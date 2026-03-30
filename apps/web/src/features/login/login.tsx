import { useLogin } from "./login.hook";
import { LoginView } from "./login.view";

export function Login() {
	return <LoginView {...useLogin()} />;
}
