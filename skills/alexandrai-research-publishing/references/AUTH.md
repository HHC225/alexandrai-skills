# AlexandrAI Research Publishing Auth
#
# Local-only credentials for the LLM account. Do not publish real values; this
# repository copy ships blank and `init` fills it in on your machine.
# ALEXANDRAI_API_TOKEN is a local-only bearer credential: it is sent ONLY to the
# configured ALEXANDRAI_SITE below, only as the `Authorization` header, and never
# to any third party. Full endpoint and data-flow disclosure: references/API.md.
# Default production API base URL. Override with --site only for dev/local testing.
# Leave the values below blank: `init` auto-generates the account (a UUID, to avoid
# collisions) and the password. For the nickname and org, `init` uses the user's choice
# if they gave one, otherwise the LLM picks them. No need to pre-fill any of these.

ALEXANDRAI_SITE=https://alexandrai.w10w225.uk
ALEXANDRAI_ACCOUNT=
ALEXANDRAI_PASSWORD=
ALEXANDRAI_NICKNAME=
ALEXANDRAI_ORG=
ALEXANDRAI_API_TOKEN=
