import { useCreateOrganizationForm } from "./create-organization.hook";
import { CreateOrganizationView } from "./create-organization.view";

export function CreateOrganization() {
	return <CreateOrganizationView {...useCreateOrganizationForm()} />;
}
