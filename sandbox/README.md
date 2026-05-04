# AIO Sandbox (agent-infra) setup for this repo

This folder wires `agent-infra/sandbox` into `foam-modme` on WSL.

## Prerequisites

- Docker installed and reachable from WSL (`docker --version`)
- At least 2GB RAM available

## First-time setup

1. Copy env template:

   `cp /home/wsl-vm/projects/foam-modme/sandbox/.env.example /home/wsl-vm/projects/foam-modme/sandbox/.env`

2. (Optional) change port/version/mount path in `.env`.

## Start

From `/home/wsl-vm/projects/foam-modme`:

`docker compose --env-file ./sandbox/.env -f ./sandbox/aio-sandbox.compose.yml up -d`

## Stop

`docker compose --env-file ./sandbox/.env -f ./sandbox/aio-sandbox.compose.yml down`

## Logs

`docker compose --env-file ./sandbox/.env -f ./sandbox/aio-sandbox.compose.yml logs -f`

## Access URLs

Assuming `AIO_SANDBOX_HOST_PORT=8080`:

- API docs: `http://localhost:8080/v1/docs`
- Dashboard: `http://localhost:8080/index.html`
- VNC: `http://localhost:8080/vnc/index.html?autoconnect=true`
- Code Server: `http://localhost:8080/code-server/`
- MCP endpoint: `http://localhost:8080/mcp`

## Notes

- This setup mounts this repository into the container at `/home/gem/workspace`.
- Official references:
  - `https://github.com/agent-infra/sandbox`
  - `https://sandbox.agent-infra.com/guide/start/quick-start`
