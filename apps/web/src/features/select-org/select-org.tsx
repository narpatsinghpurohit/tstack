import { useSelectOrg } from "./select-org.hook";
import { SelectOrgView } from "./select-org.view";

export function SelectOrg() {
	return <SelectOrgView {...useSelectOrg()} />;
}
