# openapi

## 1.2.0

### Minor Changes

- [#97](https://github.com/magicbell-io/public/pull/97) [`6fc587f`](https://github.com/magicbell-io/public/commit/6fc587f9b96864799f32fdf4a62fa3f07ab626fa) Thanks [@smeijer](https://github.com/smeijer)! - Remove the `total` and `total_pages` properties from the response of the following requests:

  - `GET /broadcasts`.
  - `GET /broadcasts/{broadcast-id}/notifications`.
  - `GET /users`.

- [#114](https://github.com/magicbell-io/public/pull/114) [`0a379c8`](https://github.com/magicbell-io/public/commit/0a379c8c18ebd1ab867c14249c5a6707e7b90c18) Thanks [@smeijer](https://github.com/smeijer)! - Remove the beta flags from the broadcasts apis. This includes:

  - `GET /broadcasts`
  - `GET /broadcasts/{broadcast_id}`
  - `GET /broadcasts/{broadcast_id}/notifications`

- [`621fd33`](https://github.com/magicbell-io/public/commit/621fd33336eb93a7e9dbb6dfb6514fe4cd98811c) Thanks [@smeijer](https://github.com/smeijer)! - Add endpoint to list notifications of a specific user

  - `GET /users/{user_id}/notifications`

- [#115](https://github.com/magicbell-io/public/pull/115) [`a4ed9c4`](https://github.com/magicbell-io/public/commit/a4ed9c4dc8bdb94d81d0c2737bb75ca5336e1efb) Thanks [@smeijer](https://github.com/smeijer)! - Remove the beta flags from the import apis. This includes:

  - `POST /imports`
  - `GET /imports/{import_id}`

- [`223c025`](https://github.com/magicbell-io/public/commit/223c0250ac76f9e456f4a7454c8b38dc872b3ab0) Thanks [@smeijer](https://github.com/smeijer)! - Add endpoint to the list the device tokens registered for push notifications of a specific user.

  - `GET /push_subscriptions`

- [#116](https://github.com/magicbell-io/public/pull/116) [`7f45ed2`](https://github.com/magicbell-io/public/commit/7f45ed2b1e2eac308a287f5d4aeefff4a6e37dcc) Thanks [@smeijer](https://github.com/smeijer)! - Remove the beta flags from the users push-subscriptions apis. This includes:

  - `GET /users/{user_id}/push_subscriptions`
  - `DELETE /users/{user_id}/push_subscriptions/{subscription_id}`

- [`9def653`](https://github.com/magicbell-io/public/commit/9def6536358f86cc87899ace03329b0806dc6ee2) Thanks [@smeijer](https://github.com/smeijer)! - add metrics endpoints:

  - `GET /metrics`
  - `GET /metrics/categories`
  - `GET /metrics/topics`

### Patch Changes

- [#95](https://github.com/magicbell-io/public/pull/95) [`0089911`](https://github.com/magicbell-io/public/commit/0089911c9fb708011370d778df119a6951a1bc79) Thanks [@smeijer](https://github.com/smeijer)! - rename operation from users-fetch to users-get to match convention.

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
