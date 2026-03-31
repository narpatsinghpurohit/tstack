import { createHash, randomUUID } from "node:crypto";
import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectConnection } from "@nestjs/mongoose";
import type {
	AuthenticatedUser,
	ForgotPasswordRequestDto,
	LoginRequestDto,
	LoginResponse,
	OrgMembership,
	RefreshTokenRequestDto,
	ResetPasswordRequestDto,
	SelectOrgRequestDto,
	SessionUser,
	SignupRequestDto,
} from "@tstack/shared";
import { DEFAULT_ROLE_NAMES } from "@tstack/shared";
import * as argon2 from "argon2";
import type { Connection } from "mongoose";
import { EmailService } from "../email/email.service";
import { MembershipRepository } from "../membership/membership.repository";
import { MembershipService } from "../membership/membership.service";
import { OrganizationRepository } from "../organization/organization.repository";
import { SystemSettingService } from "../system-setting/system-setting.service";
import { UserRepository } from "../user/user.repository";
import { UserService } from "../user/user.service";

interface TokenPair {
	accessToken: string;
	refreshToken: string;
	accessTokenExpiresAt: string;
	refreshTokenExpiresAt: string;
}

@Injectable()
export class AuthService {
	constructor(
		@InjectConnection() private readonly connection: Connection,
		private readonly userRepository: UserRepository,
		private readonly userService: UserService,
		private readonly membershipRepository: MembershipRepository,
		private readonly membershipService: MembershipService,
		private readonly orgRepository: OrganizationRepository,
		private readonly systemSettingService: SystemSettingService,
		private readonly emailService: EmailService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	async login(dto: LoginRequestDto): Promise<LoginResponse> {
		const user = await this.userRepository.findByEmail(dto.email);
		if (!user) {
			throw new UnauthorizedException("Invalid email or password");
		}

		if (user.status !== "active") {
			throw new ForbiddenException("Account is deactivated");
		}

		const valid = await argon2.verify(user.passwordHash, dto.password);
		if (!valid) {
			throw new UnauthorizedException("Invalid email or password");
		}

		const userId = String((user as unknown as { _id: string })._id);
		const memberships =
			await this.membershipService.getMembershipsForUser(userId);

		// Build org membership list
		const orgMemberships: OrgMembership[] = [];
		for (const m of memberships) {
			const org = await this.orgRepository.findById(String(m.orgId));
			if (org) {
				orgMemberships.push({
					orgId: String((org as unknown as { _id: string })._id),
					orgName: org.name,
					roleNames: m.roleNames,
					status: m.status as "active" | "inactive",
				});
			}
		}

		// Auto-select org: use currentOrgId if valid, else first active membership, else null
		let selectedOrgId: string | null = null;
		let selectedOrgName: string | null = null;

		if (user.currentOrgId) {
			const currentMembership =
				await this.membershipRepository.findByUserAndOrg(
					userId,
					String(user.currentOrgId),
				);
			if (currentMembership && currentMembership.status === "active") {
				selectedOrgId = String(user.currentOrgId);
			}
		}

		if (!selectedOrgId && orgMemberships.length > 0) {
			const activeOrg = orgMemberships.find((m) => m.status === "active");
			if (activeOrg) {
				selectedOrgId = activeOrg.orgId;
			}
		}

		if (selectedOrgId) {
			const org = await this.orgRepository.findById(selectedOrgId);
			selectedOrgName = org?.name ?? null;
		}

		// Update currentOrgId
		if (selectedOrgId) {
			await this.userRepository.updateById(userId, {
				$set: { currentOrgId: selectedOrgId },
			});
		}

		// Resolve permissions
		const permissions = await this.resolveAllPermissions(userId, selectedOrgId);

		const tokens = await this.issueTokens(
			userId,
			user.email,
			selectedOrgId,
			permissions,
		);

		// Store refresh token hash
		const refreshTokenHash = this.hashToken(tokens.refreshToken);
		const refreshTtl = this.configService.getOrThrow<string>(
			"jwt.JWT_REFRESH_TTL",
		);
		await this.userRepository.updateById(userId, {
			$set: {
				refreshTokenHash,
				refreshTokenExpiresAt: new Date(
					Date.now() + this.parseTtlMs(refreshTtl),
				),
			},
		});

		const sessionUser: SessionUser = {
			_id: userId,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			phone: user.phone,
			status: user.status as "active" | "inactive",
			orgId: selectedOrgId,
			orgName: selectedOrgName,
			permissions,
			memberships: orgMemberships,
		};

		return { user: sessionUser, tokens };
	}

	async signup(dto: SignupRequestDto): Promise<LoginResponse> {
		// Check if signup is allowed
		const allowSignup = await this.systemSettingService.getValue("allowSignup");
		if (allowSignup === false) {
			throw new ForbiddenException("Signup is currently disabled");
		}

		// Check email uniqueness
		const existing = await this.userRepository.findByEmail(dto.email);
		if (existing) {
			throw new ConflictException("Email already in use");
		}

		// Create user + org + membership atomically
		const passwordHash = await argon2.hash(dto.password);
		const slug = await this.generateSlug(dto.orgName);

		const session = await this.connection.startSession();
		let userId = "";
		let orgId = "";

		try {
			await session.withTransaction(async () => {
				const user = await this.userRepository.create(
					{
						email: dto.email,
						passwordHash,
						firstName: dto.firstName,
						lastName: dto.lastName,
						status: "active",
					},
					session,
				);

				userId = String((user as unknown as { _id: string })._id);

				const org = await this.orgRepository.create(
					{
						name: dto.orgName,
						slug,
						ownerId: userId,
						contactEmail: dto.email,
						status: "active",
						isPersonal: true,
					},
					session,
				);

				orgId = String((org as unknown as { _id: string })._id);

				await this.membershipRepository.create(
					{
						userId,
						orgId,
						roleNames: [DEFAULT_ROLE_NAMES.ADMIN],
						status: "active",
					},
					session,
				);

				await this.userRepository.updateById(
					userId,
					{ $set: { currentOrgId: orgId } },
					session,
				);
			});
		} finally {
			await session.endSession();
		}

		// Resolve permissions
		const permissions = await this.resolveAllPermissions(userId, orgId);

		const tokens = await this.issueTokens(
			userId,
			dto.email,
			orgId,
			permissions,
		);

		// Store refresh token hash
		const refreshTokenHash = this.hashToken(tokens.refreshToken);
		const refreshTtl = this.configService.getOrThrow<string>(
			"jwt.JWT_REFRESH_TTL",
		);
		await this.userRepository.updateById(userId, {
			$set: {
				refreshTokenHash,
				refreshTokenExpiresAt: new Date(
					Date.now() + this.parseTtlMs(refreshTtl),
				),
			},
		});

		const sessionUser: SessionUser = {
			_id: userId,
			email: dto.email,
			firstName: dto.firstName,
			lastName: dto.lastName,
			phone: "",
			status: "active",
			orgId,
			orgName: dto.orgName,
			permissions,
			memberships: [
				{
					orgId,
					orgName: dto.orgName,
					roleNames: [DEFAULT_ROLE_NAMES.ADMIN],
					status: "active",
				},
			],
		};

		return { user: sessionUser, tokens };
	}

	async refresh(dto: RefreshTokenRequestDto): Promise<LoginResponse> {
		let payload: AuthenticatedUser;
		try {
			payload = await this.jwtService.verifyAsync<AuthenticatedUser>(
				dto.refreshToken,
				{
					secret: this.configService.getOrThrow<string>(
						"jwt.JWT_REFRESH_SECRET",
					),
				},
			);
		} catch {
			throw new UnauthorizedException("Invalid or expired refresh token");
		}

		if (payload.tokenType !== "refresh") {
			throw new UnauthorizedException("Invalid token type");
		}

		const user = await this.userRepository.findById(payload.sub);
		if (!user || user.status !== "active") {
			throw new UnauthorizedException("User not found or inactive");
		}

		// Verify stored refresh token matches
		const tokenHash = this.hashToken(dto.refreshToken);
		if (!user.refreshTokenHash || user.refreshTokenHash !== tokenHash) {
			throw new UnauthorizedException("Refresh token has been revoked");
		}

		const userId = String((user as unknown as { _id: string })._id);
		const orgId = user.currentOrgId ? String(user.currentOrgId) : null;

		// Re-resolve permissions
		const permissions = await this.resolveAllPermissions(userId, orgId);

		const tokens = await this.issueTokens(
			userId,
			user.email,
			orgId,
			permissions,
		);

		// Update refresh token hash
		const refreshTokenHash = this.hashToken(tokens.refreshToken);
		const refreshTtl = this.configService.getOrThrow<string>(
			"jwt.JWT_REFRESH_TTL",
		);
		await this.userRepository.updateById(userId, {
			$set: {
				refreshTokenHash,
				refreshTokenExpiresAt: new Date(
					Date.now() + this.parseTtlMs(refreshTtl),
				),
			},
		});

		// Build session
		const memberships =
			await this.membershipService.getMembershipsForUser(userId);
		const orgMemberships: OrgMembership[] = [];
		for (const m of memberships) {
			const org = await this.orgRepository.findById(String(m.orgId));
			if (org) {
				orgMemberships.push({
					orgId: String((org as unknown as { _id: string })._id),
					orgName: org.name,
					roleNames: m.roleNames,
					status: m.status as "active" | "inactive",
				});
			}
		}

		let orgName: string | null = null;
		if (orgId) {
			const org = await this.orgRepository.findById(orgId);
			orgName = org?.name ?? null;
		}

		const sessionUser: SessionUser = {
			_id: userId,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			phone: user.phone,
			status: user.status as "active" | "inactive",
			orgId,
			orgName,
			permissions,
			memberships: orgMemberships,
		};

		return { user: sessionUser, tokens };
	}

	async logout(userId: string): Promise<void> {
		await this.userRepository.updateById(userId, {
			$set: {
				refreshTokenHash: null,
				refreshTokenExpiresAt: null,
			},
		});
	}

	async forgotPassword(dto: ForgotPasswordRequestDto): Promise<void> {
		const user = await this.userRepository.findByEmail(dto.email);
		if (!user) {
			// Don't reveal whether email exists
			return;
		}

		const token = randomUUID();
		const tokenHash = this.hashToken(token);
		const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

		const userId = String((user as unknown as { _id: string })._id);
		await this.userRepository.updateById(userId, {
			$set: {
				resetPasswordTokenHash: tokenHash,
				resetPasswordTokenExpiresAt: expiresAt,
			},
		});

		await this.emailService.sendPasswordResetEmail(
			dto.email,
			token,
			user.firstName,
		);
	}

	async resetPassword(dto: ResetPasswordRequestDto): Promise<void> {
		const user = await this.userRepository.findByEmail(dto.email);
		if (!user) {
			throw new BadRequestException("Invalid reset token");
		}

		const tokenHash = this.hashToken(dto.token);
		if (
			!user.resetPasswordTokenHash ||
			user.resetPasswordTokenHash !== tokenHash
		) {
			throw new BadRequestException("Invalid reset token");
		}

		if (
			!user.resetPasswordTokenExpiresAt ||
			new Date(user.resetPasswordTokenExpiresAt) < new Date()
		) {
			throw new BadRequestException("Reset token has expired");
		}

		const passwordHash = await argon2.hash(dto.newPassword);
		const userId = String((user as unknown as { _id: string })._id);

		await this.userRepository.updateById(userId, {
			$set: {
				passwordHash,
				resetPasswordTokenHash: null,
				resetPasswordTokenExpiresAt: null,
			},
		});
	}

	async selectOrg(
		userId: string,
		dto: SelectOrgRequestDto,
	): Promise<LoginResponse> {
		const membership = await this.membershipRepository.findByUserAndOrg(
			userId,
			dto.orgId,
		);

		if (!membership || membership.status !== "active") {
			throw new ForbiddenException(
				"You are not an active member of this organization",
			);
		}

		const user = await this.userService.findById(userId);
		await this.userRepository.updateById(userId, {
			$set: { currentOrgId: dto.orgId },
		});

		const permissions = await this.resolveAllPermissions(userId, dto.orgId);

		const tokens = await this.issueTokens(
			userId,
			user.email,
			dto.orgId,
			permissions,
		);

		// Update refresh token
		const refreshTokenHash = this.hashToken(tokens.refreshToken);
		const refreshTtl = this.configService.getOrThrow<string>(
			"jwt.JWT_REFRESH_TTL",
		);
		await this.userRepository.updateById(userId, {
			$set: {
				refreshTokenHash,
				refreshTokenExpiresAt: new Date(
					Date.now() + this.parseTtlMs(refreshTtl),
				),
			},
		});

		// Build session
		const memberships =
			await this.membershipService.getMembershipsForUser(userId);
		const orgMemberships: OrgMembership[] = [];
		for (const m of memberships) {
			const org = await this.orgRepository.findById(String(m.orgId));
			if (org) {
				orgMemberships.push({
					orgId: String((org as unknown as { _id: string })._id),
					orgName: org.name,
					roleNames: m.roleNames,
					status: m.status as "active" | "inactive",
				});
			}
		}

		const org = await this.orgRepository.findById(dto.orgId);

		const sessionUser: SessionUser = {
			_id: userId,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			phone: user.phone,
			status: user.status as "active" | "inactive",
			orgId: dto.orgId,
			orgName: org?.name ?? null,
			permissions,
			memberships: orgMemberships,
		};

		return { user: sessionUser, tokens };
	}

	async me(userId: string): Promise<SessionUser> {
		const user = await this.userService.findById(userId);
		const orgId = user.currentOrgId ? String(user.currentOrgId) : null;

		const permissions = await this.resolveAllPermissions(userId, orgId);

		const memberships =
			await this.membershipService.getMembershipsForUser(userId);
		const orgMemberships: OrgMembership[] = [];
		for (const m of memberships) {
			const org = await this.orgRepository.findById(String(m.orgId));
			if (org) {
				orgMemberships.push({
					orgId: String((org as unknown as { _id: string })._id),
					orgName: org.name,
					roleNames: m.roleNames,
					status: m.status as "active" | "inactive",
				});
			}
		}

		let orgName: string | null = null;
		if (orgId) {
			const org = await this.orgRepository.findById(orgId);
			orgName = org?.name ?? null;
		}

		return {
			_id: userId,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			phone: user.phone,
			status: user.status as "active" | "inactive",
			orgId,
			orgName,
			permissions,
			memberships: orgMemberships,
		};
	}

	// --- Private helpers ---

	private async resolveAllPermissions(
		userId: string,
		orgId: string | null,
	): Promise<string[]> {
		const platformPerms =
			await this.userService.resolvePlatformPermissions(userId);

		let orgPerms: string[] = [];
		if (orgId) {
			orgPerms = await this.membershipService.resolveOrgPermissions(
				userId,
				orgId,
			);
		}

		return [...new Set([...platformPerms, ...orgPerms])];
	}

	private async issueTokens(
		userId: string,
		email: string,
		orgId: string | null,
		permissions: string[],
	): Promise<TokenPair> {
		const accessTtl =
			this.configService.getOrThrow<string>("jwt.JWT_ACCESS_TTL");
		const refreshTtl = this.configService.getOrThrow<string>(
			"jwt.JWT_REFRESH_TTL",
		);

		const accessPayload: AuthenticatedUser = {
			sub: userId,
			email,
			orgId,
			permissions,
			tokenType: "access",
		};

		const refreshPayload: AuthenticatedUser = {
			sub: userId,
			email,
			orgId,
			permissions: [],
			tokenType: "refresh",
		};

		const accessExpiresMs = this.parseTtlMs(accessTtl);
		const refreshExpiresMs = this.parseTtlMs(refreshTtl);

		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(
				{ ...accessPayload } as Record<string, unknown>,
				{
					secret: this.configService.getOrThrow<string>(
						"jwt.JWT_ACCESS_SECRET",
					),
					expiresIn: Math.floor(accessExpiresMs / 1000),
				},
			),
			this.jwtService.signAsync(
				{ ...refreshPayload } as Record<string, unknown>,
				{
					secret: this.configService.getOrThrow<string>(
						"jwt.JWT_REFRESH_SECRET",
					),
					expiresIn: Math.floor(refreshExpiresMs / 1000),
				},
			),
		]);

		return {
			accessToken,
			refreshToken,
			accessTokenExpiresAt: new Date(
				Date.now() + this.parseTtlMs(accessTtl),
			).toISOString(),
			refreshTokenExpiresAt: new Date(
				Date.now() + this.parseTtlMs(refreshTtl),
			).toISOString(),
		};
	}

	private hashToken(token: string): string {
		return createHash("sha256").update(token).digest("hex");
	}

	private parseTtlMs(ttl: string): number {
		const match = ttl.match(/^(\d+)(s|m|h|d)$/);
		if (!match) return 15 * 60 * 1000; // default 15m

		const value = Number.parseInt(match[1], 10);
		switch (match[2]) {
			case "s":
				return value * 1000;
			case "m":
				return value * 60 * 1000;
			case "h":
				return value * 60 * 60 * 1000;
			case "d":
				return value * 24 * 60 * 60 * 1000;
			default:
				return 15 * 60 * 1000;
		}
	}

	private async generateSlug(name: string): Promise<string> {
		const base = name
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "");

		let slug = base;
		let counter = 1;
		while (await this.orgRepository.findBySlug(slug)) {
			slug = `${base}-${counter}`;
			counter++;
		}
		return slug;
	}
}
