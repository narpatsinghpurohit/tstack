export interface Permissible {
	permissions: string[];
}

export function can(subject: Permissible, permission: string): boolean {
	return subject.permissions.includes(permission);
}

export function cannot(subject: Permissible, permission: string): boolean {
	return !can(subject, permission);
}

export function canAny(subject: Permissible, permissions: string[]): boolean {
	return permissions.some((p) => subject.permissions.includes(p));
}

export function canAll(subject: Permissible, permissions: string[]): boolean {
	return permissions.every((p) => subject.permissions.includes(p));
}
