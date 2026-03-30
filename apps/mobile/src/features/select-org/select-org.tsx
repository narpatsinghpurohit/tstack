import { useSelectOrg } from "./select-org.hook";
import { SelectOrgView } from "./select-org.view";

export function SelectOrgScreen() {
	return <SelectOrgView {...useSelectOrg()} />;
}
