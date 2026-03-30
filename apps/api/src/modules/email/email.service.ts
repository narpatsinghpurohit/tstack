import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

@Injectable()
export class EmailService {
	private readonly logger = new Logger(EmailService.name);
	private transporter: Transporter;

	constructor(private readonly configService: ConfigService) {
		const host = this.configService.get<string>("email.SMTP_HOST", "");
		const port = this.configService.get<number>("email.SMTP_PORT", 587);
		const user = this.configService.get<string>("email.SMTP_USER", "");
		const pass = this.configService.get<string>("email.SMTP_PASS", "");

		this.transporter = nodemailer.createTransport({
			host,
			port,
			secure: port === 465,
			auth:
				user && pass
					? { user, pass }
					: undefined,
		});
	}

	async sendEmail(
		to: string,
		subject: string,
		html: string,
	): Promise<void> {
		const from = this.configService.get<string>(
			"email.SMTP_FROM_EMAIL",
			"noreply@tstack.app",
		);

		try {
			await this.transporter.sendMail({ from, to, subject, html });
			this.logger.log(`Email sent to ${to}: ${subject}`);
		} catch (error) {
			this.logger.error(
				`Failed to send email to ${to}: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	async sendPasswordResetEmail(
		to: string,
		token: string,
		firstName: string,
	): Promise<void> {
		const frontendOrigin = this.configService.get<string>(
			"app.FRONTEND_ORIGIN",
			"http://localhost:5173",
		);
		const resetUrl = `${frontendOrigin}/reset-password?email=${encodeURIComponent(to)}&token=${encodeURIComponent(token)}`;

		const html = `
			<h2>Password Reset</h2>
			<p>Hi ${firstName},</p>
			<p>You requested a password reset. Click the link below to set a new password:</p>
			<p><a href="${resetUrl}">Reset Password</a></p>
			<p>This link expires in 15 minutes.</p>
			<p>If you didn't request this, please ignore this email.</p>
		`;

		await this.sendEmail(to, "Password Reset Request", html);
	}

	async sendInvitationEmail(
		to: string,
		token: string,
		orgName: string,
		invitedByName: string,
	): Promise<void> {
		const frontendOrigin = this.configService.get<string>(
			"app.FRONTEND_ORIGIN",
			"http://localhost:5173",
		);
		const acceptUrl = `${frontendOrigin}/invitations/accept?token=${encodeURIComponent(token)}`;

		const html = `
			<h2>You've been invited!</h2>
			<p>${invitedByName} has invited you to join <strong>${orgName}</strong>.</p>
			<p><a href="${acceptUrl}">Accept Invitation</a></p>
			<p>This invitation expires in 7 days.</p>
		`;

		await this.sendEmail(
			to,
			`Invitation to join ${orgName}`,
			html,
		);
	}
}
