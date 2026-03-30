import { createFileRoute } from "@tanstack/react-router";
import { CreateOrganization } from "@/features/create-organization";

export const Route = createFileRoute("/_authenticated/create-organization")({
	component: CreateOrganization,
});
