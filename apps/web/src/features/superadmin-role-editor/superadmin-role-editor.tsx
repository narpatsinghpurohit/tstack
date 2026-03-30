import { useSuperadminRoleEditor } from "./superadmin-role-editor.hook";
import { SuperadminRoleEditorView } from "./superadmin-role-editor.view";

export function SuperadminRoleEditor() {
	return <SuperadminRoleEditorView {...useSuperadminRoleEditor()} />;
}
