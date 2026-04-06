# GitHub App Permission & Install Checklist for ContextStream Integration

This checklist helps you create a GitHub App for integrating a repository with ContextStream while following least-privilege principles.

1) Choose auth method

- Recommended: GitHub App (install per-repo or per-org). Preferred over PAT/OAuth because of fine-grained permissions and webhook support.

1) Create the GitHub App

- Visit: <https://github.com/settings/apps> -> New GitHub App
- Name: `ContextStream Integration - <org/repo>`
- Homepage URL: <https://contextstream.io>
- Callback URL: (not required for App-only workflows; fill if using OAuth)
- Webhook URL: https://<your-middleware>/webhook (if you host middleware) OR use ContextStream hosted connector if available
- Webhook secret: generate a strong secret and store it in ContextStream integration settings

1) Permissions (grant only what you need)

- Repository permissions (minimum recommended):
  - Issues: Read & Write (Write only if App will add labels like `capture:decision`)
  - Pull requests: Read
  - Pull request reviews: Read
  - Contents: Read (optional; only if you want code excerpts included)
  - Checks: Read
  - Actions: Read (if you want to surface workflow runs)
- Organization permissions (if needed):
  - Members: Read (only if mapping teams to roles is required)

1) Events (webhook subscriptions)

- Subscribe at minimum to:
  - issues
  - issue_comment
  - pull_request
  - pull_request_review
  - check_run
  - workflow_run
  - release (optional)

1) Install the GitHub App

- Install to specific repositories only (avoid full org install unless required)
- Note the installation id and private key (download key file)

1) Exchange tokens

- Use the GitHub App private key + installation id to generate an installation access token for API calls
- Rotation: regenerate private key periodically and rotate installation tokens

1) Configure ContextStream

- Go to <https://contextstream.io/settings/integrations/github> (or use ContextStream admin UI)
- Choose GitHub App and provide App id, private key (or use hosted OAuth flow) and webhook secret
- Map repositories to ContextStream projects (so events are associated correctly)

1) Secrets & least privilege

- Store App credentials and webhook secret in a secure vault (GitHub Secrets, environment variables, or ContextStream secrets configuration)
- For subagents, create separate tokens with narrower scopes and shorter lifetimes

1) Validation & testing

- Create a test issue and label it `capture:decision` to validate the auto-capture Flow
- Trigger PR events and check that ContextStream receives the event and links it to the correct project

1) Security checklist

- Use GitHub App over PAT when possible
- Validate webhook signatures on your receiver
- Limit installations to required repos
- Monitor app installation activity and rotate keys
