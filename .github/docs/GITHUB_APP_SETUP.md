# GitHub App Setup Guide

This guide walks you through creating a GitHub App (bot identity) for the agent
pipeline so it can post PR reviews and approvals without using a personal
access token.

## Why a GitHub App?

| PAT (Personal Access Token) | GitHub App |
|-----------------------------|-----------|
| Tied to a personal account | Acts as its own bot identity |
| Broad, hard-to-revoke scopes | Fine-grained, per-repo permissions |
| Rotated manually | Short-lived installation tokens (1 h) |
| Harder to audit | Full audit trail in security log |

A GitHub App is the **recommended** approach for production automation.

## Step 1 — Create the App

1. Go to **Settings → Developer settings → GitHub Apps** (or your organisation's
   equivalent).
2. Click **New GitHub App**.
3. Fill in the required fields:

   | Field | Value |
   |-------|-------|
   | **App name** | `mcapp-agent-bot` (must be globally unique) |
   | **Homepage URL** | `https://github.com/<OWNER>/<REPO>` |
   | **Webhook** | Disable (uncheck "Active") unless you need event-driven runs |

4. Set the following **Repository permissions**:

   | Permission | Level |
   |-----------|-------|
   | Contents | Read |
   | Pull requests | Write |
   | Checks | Write |
   | Metadata | Read (automatically granted) |

5. Leave all other permissions as **No access**.

6. Under **Where can this GitHub App be installed?**, choose **Only on this account**.

7. Click **Create GitHub App**.

## Step 2 — Generate a private key

1. On the App settings page, scroll to **Private keys**.
2. Click **Generate a private key**.
3. A `.pem` file downloads automatically — store it somewhere safe.

> **Never commit the `.pem` file to any repository.**

## Step 3 — Install the App on your repository

1. In the App settings, click **Install App** (left sidebar).
2. Click **Install** next to your account.
3. Choose **Only select repositories → `<REPO_NAME>`**.
4. Click **Install**.
5. Note the **Installation ID** from the URL:
   `https://github.com/settings/installations/<INSTALLATION_ID>`

## Step 4 — Store secrets in the repository

1. In the repository, go to **Settings → Secrets and variables → Actions**.
2. Add the following **repository secrets**:

   | Secret name | Value |
   |-------------|-------|
   | `AGENT_BOT_APP_ID` | The App ID shown on the App settings page |
   | `AGENT_BOT_PRIVATE_KEY` | The full contents of the downloaded `.pem` file |
   | `AGENT_BOT_INSTALLATION_ID` | The Installation ID from step 3 |

## Step 5 — Use the App token in workflows

Add this step at the start of any job that needs elevated permissions
(e.g., `approval-decision`):

```yaml
- name: Generate App token
  id: app-token
  uses: actions/create-github-app-token@v1
  with:
    app-id: ${{ secrets.AGENT_BOT_APP_ID }}
    private-key: ${{ secrets.AGENT_BOT_PRIVATE_KEY }}

# Then reference the token as:
#   ${{ steps.app-token.outputs.token }}
```

The generated token is short-lived (1 hour) and scoped only to the permissions
granted in Step 1.

## Step 6 — Update the orchestrator workflow (optional)

The `agent-orchestrator.yml` workflow currently uses `github.token` (the built-in
GITHUB_TOKEN) which is sufficient for most operations.  Switch to the App token
only if you need the review to count towards branch protection rules that require
a specific reviewer identity.

Replace:
```yaml
env:
  GITHUB_TOKEN: ${{ github.token }}
```

With:
```yaml
env:
  GITHUB_TOKEN: ${{ steps.app-token.outputs.token }}
```

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `Resource not accessible by integration` | Missing permission | Add the permission in App settings and reinstall |
| `Bad credentials` | Wrong App ID or key | Verify `AGENT_BOT_APP_ID` and regenerate the key |
| `JWT expired` | Clock skew | Ensure the runner's system clock is correct |
| Review not counting toward protection rules | Token is `github.token` not App token | Switch to the App token (Step 6) |
