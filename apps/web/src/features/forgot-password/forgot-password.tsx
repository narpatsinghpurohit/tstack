import { useForgotPassword } from "./forgot-password.hook";
import { ForgotPasswordView } from "./forgot-password.view";

export function ForgotPassword() {
	return <ForgotPasswordView {...useForgotPassword()} />;
}
