# MagicBell's OpenAPI Specification

This repository contains [OpenAPI specifications][openapi] for the MagicBell REST API.

[Changelog](https://github.com/magicbell/openapi/releases/)


Files can be found in the [/spec](/spec) directory:

* `openapi.json,yaml:` OpenAPI 3.0 spec matching the public MagicBell API.

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
