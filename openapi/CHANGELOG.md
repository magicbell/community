# openapi

## 1.1.0

### Minor Changes

- [#91](https://github.com/magicbell-io/public/pull/91) [`59379b6`](https://github.com/magicbell-io/public/commit/59379b6bdd5cfc4a80716dd7fb63922600f7c20c) Thanks [@smeijer](https://github.com/smeijer)! - update broadcast > notification schema to include the fields:

  - `created_at`; datetime when notification was created
  - `updated_at`; datetime when notification was last updated
  - `seen_at`; datetime when notification was first seen
  - `read_at`; datetime when notification was first read
  - `status`; enum showing current state, current values: `unseen`, `unread`, `read`, `archived`

  Further changes are:

  - `recipient`; is marked as non-nullable
  - `deliveries`; is marked as non-nullable
