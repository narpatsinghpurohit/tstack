import { useLogin } from "./login.hook";
import { LoginView } from "./login.view";

export function LoginScreen() {
	return <LoginView {...useLogin()} />;
}
