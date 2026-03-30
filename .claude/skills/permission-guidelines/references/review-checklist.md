# Permission Review Checklist

Use this checklist when reviewing any feature that adds or changes protected behavior.

## Shared Definitions

- [ ] Permission names are defined in `packages/shared`
- [ ] Grouped permissions available via `GET /permissions/grouped` when needed for UI
- [ ] Shared permission tests are updated or verified when permission catalogs change

## Backend

- [ ] Every protected endpoint uses `@Can(...)` or `@CanAny(...)` or a justified dynamic permission check
- [ ] Dynamic/entity-aware permission checks map to the correct action and entity
- [ ] Institute scoping is preserved in controller/service/repository flow
- [ ] No protected endpoint relies on frontend hiding alone

## Frontend

- [ ] Route/surface access is gated appropriately
- [ ] Action buttons, row actions, dialogs, and empty-state CTAs are permission-gated
- [ ] Frontend permission checks mirror backend permission names exactly
- [ ] Authorization checks use the resolved permission list, nothing else

## Alignment

- [ ] A user who lacks permission cannot perform the action through the API
- [ ] A user who lacks permission also does not see misleading UI entry points
- [ ] Broad surface helpers are not accidentally exposing a feature outside its intended audience
- [ ] Tests or manual verification cover at least one allowed and one denied permission scenario where practical

## Current Repo Caveats

Keep these in mind during review:
- route surface access is broader than feature-level permission checks
