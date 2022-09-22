# MagicBell's OpenAPI Specification

This repository contains [OpenAPI specifications][openapi] for the MagicBell REST API.

[Changelog](https://github.com/magicbell/openapi/releases/)

Files can be found in the [/spec](/spec) directory:

- `openapi.json,yaml:` OpenAPI 3.0 spec matching the public MagicBell API.

## Vendor Extensions

The specification ships with a few vendor-specific fields to help represent information in ways that are difficult or unsupported in OpenAPI by default.

### x-beta

`MethodObjects` can contain an `x-beta: true` property to indicate that the method is in beta or for other reasons unreleased. While you may be able to query them, they are unsupported and might be changed or even removed without notice.

```json
{
  "paths": {
    "/easter-eggs": {
      "get": {
        "x-beta": true
      }
    }
  }
}
```

## Development

Run the test suite:

```shell
# clone the repo
git clone git@github.com:magicbell-io/openapi.git
cd openapi

# install dependencies
yarn

# validate the current spec
yarn validate
```

## Code Quality

We're using pre-commit hooks to maintain consistency in code style for scripts in [/scripts](/scripts), and to verify
that the openapi spec is valid according to openapi schemas. Please keep them enabled.

[openapi]: https://www.openapis.org/
