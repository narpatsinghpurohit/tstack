import { useResetPassword } from "./reset-password.hook";
import { ResetPasswordView } from "./reset-password.view";

export function ResetPassword({
	token,
	email,
}: {
	token: string;
	email: string;
}) {
	return <ResetPasswordView {...useResetPassword({ token, email })} />;
}
