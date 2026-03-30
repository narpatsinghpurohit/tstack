import { z } from "zod";

// --- Login ---
export const loginRequestSchema = z.object({
	email: z.string().email().trim().toLowerCase(),
	password: z.string().min(1, "Password is required"),
});
export type LoginRequestDto = z.infer<typeof loginRequestSchema>;

// --- Signup ---
export const signupRequestSchema = z.object({
	firstName: z.string().trim().min(1, "First name is required").max(100),
	lastName: z.string().trim().min(1, "Last name is required").max(100),
	email: z.string().email().trim().toLowerCase(),
	password: z.string().min(8, "Password must be at least 8 characters").max(128),
	orgName: z.string().trim().min(1, "Organization name is required").max(200),
});
export type SignupRequestDto = z.infer<typeof signupRequestSchema>;

// --- Refresh Token ---
export const refreshTokenRequestSchema = z.object({
	refreshToken: z.string().min(1),
});
export type RefreshTokenRequestDto = z.infer<typeof refreshTokenRequestSchema>;

// --- Forgot Password ---
export const forgotPasswordRequestSchema = z.object({
	email: z.string().email().trim().toLowerCase(),
});
export type ForgotPasswordRequestDto = z.infer<typeof forgotPasswordRequestSchema>;

// --- Reset Password ---
export const resetPasswordRequestSchema = z.object({
	email: z.string().email().trim().toLowerCase(),
	token: z.string().min(1),
	newPassword: z.string().min(8).max(128),
});
export type ResetPasswordRequestDto = z.infer<typeof resetPasswordRequestSchema>;

// --- Select Org ---
export const selectOrgRequestSchema = z.object({
	orgId: z.string().min(1),
});
export type SelectOrgRequestDto = z.infer<typeof selectOrgRequestSchema>;

// --- Auth Tokens Response ---
export const authTokensSchema = z.object({
	accessToken: z.string(),
	refreshToken: z.string(),
	accessTokenExpiresAt: z.string(),
	refreshTokenExpiresAt: z.string(),
});
export type AuthTokens = z.infer<typeof authTokensSchema>;

// --- Org Membership (for login response) ---
export const orgMembershipSchema = z.object({
	orgId: z.string(),
	orgName: z.string(),
	roleNames: z.array(z.string()),
	status: z.enum(["active", "inactive"]),
});
export type OrgMembership = z.infer<typeof orgMembershipSchema>;

// --- Session User ---
export const sessionUserSchema = z.object({
	_id: z.string(),
	email: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	phone: z.string().optional(),
	status: z.enum(["active", "inactive"]),
	orgId: z.string().nullable(),
	orgName: z.string().nullable(),
	permissions: z.array(z.string()),
	memberships: z.array(orgMembershipSchema),
});
export type SessionUser = z.infer<typeof sessionUserSchema>;

// --- Login Response ---
export const loginResponseSchema = z.object({
	user: sessionUserSchema,
	tokens: authTokensSchema,
});
export type LoginResponse = z.infer<typeof loginResponseSchema>;
