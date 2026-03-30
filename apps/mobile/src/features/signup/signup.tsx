import { useSignup } from "./signup.hook";
import { SignupView } from "./signup.view";

export function SignupScreen() {
	return <SignupView {...useSignup()} />;
}
