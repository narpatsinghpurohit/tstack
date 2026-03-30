import { useSignup } from "./signup.hook";
import { SignupView } from "./signup.view";

export function Signup() {
	return <SignupView {...useSignup()} />;
}
