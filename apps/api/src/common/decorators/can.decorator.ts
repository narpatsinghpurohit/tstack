import { SetMetadata } from "@nestjs/common";

export const REQUIRED_PERMISSIONS_KEY = "requiredPermissions";
export const REQUIRED_PERMISSIONS_MODE_KEY = "requiredPermissionsMode";

/**
 * Require ALL listed permissions (AND logic).
 */
export const Can = (...permissions: string[]) => {
	return (
		target: object,
		propertyKey?: string | symbol,
		descriptor?: PropertyDescriptor,
	) => {
		SetMetadata(REQUIRED_PERMISSIONS_KEY, permissions)(
			target,
			propertyKey as string,
			descriptor as PropertyDescriptor,
		);
		SetMetadata(REQUIRED_PERMISSIONS_MODE_KEY, "all")(
			target,
			propertyKey as string,
			descriptor as PropertyDescriptor,
		);
	};
};

/**
 * Require ANY one of the listed permissions (OR logic).
 */
export const CanAny = (...permissions: string[]) => {
	return (
		target: object,
		propertyKey?: string | symbol,
		descriptor?: PropertyDescriptor,
	) => {
		SetMetadata(REQUIRED_PERMISSIONS_KEY, permissions)(
			target,
			propertyKey as string,
			descriptor as PropertyDescriptor,
		);
		SetMetadata(REQUIRED_PERMISSIONS_MODE_KEY, "any")(
			target,
			propertyKey as string,
			descriptor as PropertyDescriptor,
		);
	};
};
