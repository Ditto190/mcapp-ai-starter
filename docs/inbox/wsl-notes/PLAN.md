# WSL + Turborepo Setup Guide

## Complete Setup for Claude Code + Agentic Development on Accenture Managed Windows Laptops

**Generated from:** Copilot conversation (2026-05-03)  
**Target audience:** Anyone setting up local-first development on Windows 11 with WSL2  
**Scope:** WSL + Node.js + Bun + Turborepo (with-microfrontends template)  
**Estimated time:** 45–60 minutes from start to `localhost:3024` running

---

## Executive Summary

This guide takes you from a clean WSL2 Ubuntu installation to a running Turborepo monorepo with **multi-app local orchestration** at a single port (`localhost:3024`). The setup is enterprise-safe for Accenture managed laptops: all development happens inside Linux, never in OneDrive, Windows PATH, or system folders. You'll use **Bun** as the all-in-one toolkit (package manager + runner) and the **with-microfrontends** Turborepo template to scaffold multiple apps with shared components. At the end, you'll have a clean, auditable development environment ready for Claude Code integration and agentic project exploration.

---

## Part 1: Prerequisites & Validation

### 1.1 What You Need Before Starting

✅ **Already installed:**

- Windows 11 with WSL2 enabled (tested)
- Ubuntu 22.04 LTS or later in WSL2
- zsh shell with oh-my-zsh configured
- Terminal access to WSL via Windows Terminal or similar

**Verify your baseline now:**

```shell
# Check you're in WSL, not Windows
pwd
# Expected: /home/wsl-vm (or your username)

# Check zsh is the active shell
echo $SHELL
# Expected: /bin/zsh

# Check oh-my-zsh is installed
echo $ZSH
# Expected: /home/wsl-vm/.oh-my-zsh (or similar)
```

If any output is unexpected, stop here and verify your WSL + zsh setup first.

### 1.2 What This Guide Covers (and Doesn't)

**✅ Covers:**

- Installing Node.js + nvm (Linux version, inside WSL)
- Installing Bun as package manager + runner
- Creating a Turborepo monorepo from the official with-microfrontends template
- Configuring VS Code to work safely with WSL (critical rules included)
- Running the dev server and accessing multi-app proxy at localhost:3024
- Organizing your project structure safely (no OneDrive interference)

**❌ Does NOT cover:**

- Initial WSL2 installation (assume you have this)
- Advanced Turborepo configuration (task scheduling, remote caching, etc.)
- HeroUI component library integration (next step after this guide works)
- Deployment to Vercel (covered separately)

### 1.3 Why This Approach (vs alternatives)

| Choice | Why This One | Alternative | Trade-off |
|--------|-------------|-------------|-----------|
| **WSL2 for Node.js** | Absolute OneDrive isolation + Linux-native Node + Accenture IT-friendly | Native Windows + NVM | WSL has tiny startup overhead |
| **Bun (not npm/yarn/pnpm)** | Single binary, fast, Turborepo auto-detection, bunx works great | npm or pnpm | Newer ecosystem, fewer StackOverflow answers |
| **with-microfrontends template** | Local multi-app proxy at single port (localhost:3024) + official Turborepo example | design-system or kitchen-sink | Includes Next.js by default; you can add Vite apps later |

---

## Part 2: Core Setup (in dependency order)

### 2.1 Install Node.js + nvm (Linux version)

**Why nvm?** Version control for Node. When Claude tooling or Turborepo needs a different Node version, nvm makes switching seamless (no reinstall).

**Step 1: Check if Node or nvm already exists**

```shell
which node
# If you see: /usr/bin/node → Node was installed via apt (workable, but less flexible)
# If you see: /home/wsl-vm/.nvm/... → nvm already installed (skip to Step 3)
# If you see: command not found → Good, we'll install cleanly

which nvm
# If you see: nvm → Already installed (skip to Step 3)
# If you see: command not found → We'll install it
```

**Step 2: Install Linux nvm**

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

**Important:** After this command, exit WSL and reopen it:

```shell
exit
```

Then open a new WSL terminal tab.

**Verify nvm is wired into your shell:**

```shell
nvm --version
# Expected: v0.39.7 (or current version)
# ❌ If: command not found → the script didn't wire zsh properly. See Troubleshooting section.
```

**Step 3: Install Node LTS**

```shell
nvm install --lts
nvm use --lts
```

**Verify:**

```shell
node -v
npm -v
which node
# Expected output:
# v20.x.x (or current LTS version)
# 10.x.x (or current npm version)
# /home/wsl-vm/.nvm/versions/node/v20.x.x/bin/node
```

✅ If all three match the "Expected" above, Node is correctly installed.

❌ **RED FLAG:** If `which node` shows `/mnt/c` or `/Program Files` → Windows Node is leaking into your WSL session. Stop and see Troubleshooting.

**Step 4: Create project directory**

```shell
mkdir -p ~/projects/claude
cd ~/projects/claude
```

This is now your safe development root. Everything Node-related goes here (and is invisible to OneDrive).

---

### 2.2 Install Bun

**Why Bun?** Speed, all-in-one toolkit (package manager + script runner + npx alternative via bunx), and Turborepo integrates perfectly.

**Step 1: Download and install Bun**

```shell
curl -fsSL https://bun.sh/install | bash
```

**Step 2: Add Bun to your zsh PATH**

Bun installs to `$HOME/.bun` by default. Make sure it's on your PATH:

```shell
# Check for existing Bun config in ~/.zshrc
grep -q 'BUN_INSTALL' ~/.zshrc && echo "Bun already in ~/.zshrc" || echo "Bun not found in ~/.zshrc"
```

If "Bun not found in ~/.zshrc", add it:

```shell
echo 'export BUN_INSTALL="$HOME/.bun"' >> ~/.zshrc
echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Step 3: Verify Bun is on PATH**

```shell
bun --version
bunx --version
# Expected: 1.3.13 (or current version)
```

✅ If both commands show a version number, Bun is ready.

❌ **RED FLAG:** If either shows "command not found" → Bun didn't get added to PATH. Check that `~/.zshrc` has the two lines above, then `source ~/.zshrc` again.

---

### 2.3 Verification Checklist (Node + Bun)

Before moving to Turborepo, confirm everything is in place:

```shell
# Check all three are pointing to WSL Linux, not Windows
which node      # ✅ Should show /home/wsl-vm/.nvm/...
which npm       # ✅ Should show /home/wsl-vm/.nvm/... 
which bun       # ✅ Should show /home/wsl-vm/.bun/...

# Verify versions
node -v         # ✅ Should show v20+
npm -v          # ✅ Should show 10+
bun --version   # ✅ Should show 1.3+

# Check we're in the right directory
pwd             # ✅ Should show /home/wsl-vm/projects/claude
```

**If all six checks pass (✅):** You're ready for Turborepo.

**If any check shows Windows paths or "command not found":** See Troubleshooting before continuing.

---

## Part 3: Directory Structure (Safe Organization)

### 3.1 Your Current State

If you're following this guide fresh, you probably have:

```
/home/wsl-vm/
├─ .nvm/                  (hidden, installed by nvm)
├─ .oh-my-zsh/            (hidden, oh-my-zsh)
├─ .zshrc                 (hidden, shell config)
├─ projects/
│  └─ claude/             (you created this)
```

### 3.2 Target Layout (Gold Standard)

After setting up Turborepo, you'll have:

```
/home/wsl-vm/
├─ .nvm/                          (Node version manager)
├─ .oh-my-zsh/                    (Shell themes/plugins)
├─ .zshrc                         (Shell config)
├─ projects/
│  └─ claude/
│     └─ turbo-lab/               ← Your Turborepo monorepo
│        ├─ apps/
│        │  └─ web/               (Next.js app from template)
│        ├─ packages/
│        │  └─ ui/                (Shared components)
│        ├─ turbo.json
│        ├─ package.json
│        └─ bun.lock              (Bun's lockfile)
```

**Key principle:** All projects live under `~/projects/claude/`, and Turborepo orchestrates them from there.

### 3.3 Why This Matters

- ✅ `$HOME` stays clean (no node_modules clutter)
- ✅ Projects are scoped and easy to back up
- ✅ Easy to delete and recreate a monorepo while keeping others intact
- ✅ VS Code can open any subdirectory without confusion
- ✅ OneDrive never sees anything (it's all in Linux)

**If you already have node_modules or package.json in $HOME:** That's okay. We'll address it as an optional cleanup step after Turborepo is running. For now, proceed to Part 4.

---

## Part 4: VS Code + WSL Wiring (Critical Safety Rules)

This section is **non-negotiable**. Get this wrong and your development environment silently leaks into Windows paths, OneDrive, and PATH pollution.

### 4.1 The Core Rule (Memorize This)

> **VS Code uses the filesystem of whatever environment launched it.**

- **If you launch VS Code from WSL terminal** (`code .`) → VS Code opens in WSL mode, uses Linux Node, everything is safe.
- **If you launch VS Code from Windows Explorer** (right-click → Open with VS Code) → VS Code opens in Windows mode, uses Windows PATH, Node might resolve to Windows, node_modules might land in OneDrive.

This is the single most important decision in the entire setup.

### 4.2 Golden Rules (Write These Down)

**🟢 RULE 1: Only open VS Code from WSL terminal using `code .`**

```shell
cd ~/projects/claude/turbo-lab
code .
```

Never use Windows Explorer, Start menu, or desktop shortcuts.

**🟢 RULE 2: Folder paths must start with `/home`**

If your active folder path starts with `/mnt`, you're working in Windows filesystem. Stop immediately.

Verify in VS Code's integrated terminal:

```shell
pwd
# ✅ Expected: /home/wsl-vm/projects/claude/turbo-lab
# ❌ Bad: /mnt/c/Users/...
```

**🟢 RULE 3: VS Code's bottom-left corner must say "WSL: Ubuntu"**

Look at the very bottom-left of the VS Code window.

- ✅ Good: Shows "WSL: Ubuntu" (or similar)
- ❌ Bad: Shows nothing, or shows "><" (indicates Windows mode)

If it doesn't say WSL: Ubuntu, close VS Code and reopen from WSL terminal using `code .`

**🟢 RULE 4: `which node` must never end in `.exe`**

In VS Code's terminal:

```shell
which node
# ✅ Expected: /home/wsl-vm/.nvm/versions/node/v20.x.x/bin/node
# ❌ Bad: C:\Program Files\nodejs\node.exe
```

If you see `.exe`, Windows Node is leaking in. Close VS Code and restart from WSL terminal.

**🟢 RULE 5: Close VS Code before moving files**

If you're reorganizing directories:

```shell
# 1. Close VS Code completely
# 2. Do your file moves from WSL terminal
# 3. Reopen VS Code with: code .
```

Never move folders while VS Code is open to them (it can get confused).

### 4.3 Verification Checklist

When VS Code is open and you're ready to code, run this checklist:

**Checklist Item 1: Bottom-left indicator**

Look at the very bottom-left of VS Code.

- ✅ Should show "WSL: Ubuntu" (with icon)
- ❌ If blank or shows "><" → you opened from Windows. Close and restart from WSL terminal.

**Checklist Item 2: Terminal type in VS Code**

Open the integrated terminal (`` Ctrl+` ``).

```shell
# You should see a prompt like:
# wsl-vm   ~/projects/claude/turbo-lab
# with zsh somewhere in the prompt
# ✅ Good if you see zsh shell indicators

# ❌ Bad if you see PowerShell or cmd.exe
```

**Checklist Item 3: Node path**

```shell
which node
# ✅ Expected: /home/wsl-vm/.nvm/versions/node/v20.x.x/bin/node
# ❌ If you see any .exe → STOP, close VS Code, restart from WSL terminal
```

**If all three checks pass:** You're safe to code.

### 4.4 How to Open Correctly (Step-by-Step)

**The right way:**

```shell
# 1. Open Windows Terminal or WSL terminal
# 2. Navigate to your project
cd ~/projects/claude/turbo-lab

# 3. Open VS Code from here
code .

# 4. Wait for VS Code to open and fully load
# 5. Check the bottom-left says "WSL: Ubuntu"
# 6. You're ready
```

**What to avoid:**

- ❌ Clicking "Open with VS Code" from Windows Explorer
- ❌ Using File → Open Folder from VS Code's File menu (this may default to Windows)
- ❌ Double-clicking a workspace file from Windows Explorer
- ❌ Opening a recent folder from VS Code that you don't recognize

---

## Part 5: Turborepo Setup (with-microfrontends)

### 5.1 What You're Creating

The `with-microfrontends` template gives you:

- ✅ A local **proxy** that runs all apps behind a single URL (`localhost:3024`)
- ✅ Multiple **apps** (Next.js by default, you can add Vite later)
- ✅ A **shared packages** folder for reusable components (e.g., HeroUI UI kit)
- ✅ **Turborepo task orchestration** to run all apps with one command
- ✅ **Bun** as the package manager and script runner

In plain English: You type `bunx turbo dev` once, and all your apps start in parallel, accessible from a single localhost port.

### 5.2 Create the Repository

**Step 1: Navigate to your projects folder**

```shell
cd ~/projects/claude
pwd
# Expected: /home/wsl-vm/projects/claude
```

**Step 2: Create Turborepo using the official with-microfrontends template**

```shell
bunx create-turbo@latest -e with-microfrontends
```

**Step 3: At the first prompt, specify the folder name**

You'll see:

```
? Where would you like to create your Turborepo? (./my-turborepo)
```

Type:

```
./turbo-lab
```

Then press **Enter**.

**Step 4: At the package manager prompt, choose Bun**

You'll see:

```
? Which package manager do you want to use?
❯ npm
  bun
  yarn
  pnpm
```

Press **Down Arrow** once to highlight `bun`, then press **Enter**.

The scaffolder will now create your repository structure. This takes ~30 seconds.

### 5.3 Install Dependencies

**Step 1: Navigate into the new repo**

```shell
cd ~/projects/claude/turbo-lab
ls
# Expected to see: apps, packages, turbo.json, package.json, etc.
```

**Step 2: Install all dependencies using Bun**

```shell
bun install
```

This will:

- Install all root-level dependencies
- Install all app dependencies
- Install all shared package dependencies
- Create a `bun.lock` file (Bun's lockfile)

**Expected output:**

- Should complete in <30 seconds (Bun is fast)
- Should NOT show errors about npm/yarn/pnpm conflicts
- Should show something like "✓ Installed 250 packages"

**Verification:**

```shell
ls
# You should now see: bun.lock (in addition to previous files)
```

### 5.4 Run the Dev Server

**Step 1: Start Turborepo + all apps**

```shell
bunx turbo dev
```

This command:

- Starts Turborepo's task orchestrator
- Runs the `dev` script from all apps in `apps/`
- Starts a local proxy that routes requests to the correct app

**Expected output (after ~10 seconds):**

```
turbo run dev

▲ turbo v1.x.x
apps/web: starting dev server on port 3000
apps/web: ready in 2.5s
   ↳ http://localhost:3000
proxy: listening on port 3024
   ↳ http://localhost:3024
```

**Key line:** `proxy: listening on port 3024`

### 5.5 Access the Multi-App Proxy

**Step 1: Open your browser**

Navigate to:

```
http://localhost:3024
```

**Expected behavior:**

- Page loads successfully
- You see content from the `apps/web` Next.js app
- The URL stays at `localhost:3024` (the proxy is routing for you)

**Step 2: Verify Turborepo is orchestrating**

Back in your terminal, you should see:

```
[web] ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

This means:

- ✅ Apps are running on their individual ports (3000, 3001, etc.)
- ✅ The proxy is accepting requests at 3024 and forwarding them
- ✅ Turborepo is managing all apps from one `turbo dev` command

**If you want to add more apps later:**

The template is ready for it. You'd create a new app in `apps/` and update the Turborepo configuration. For now, the single app is fully functional.

### 5.6 Stop the Server (When Done)

```shell
# Press Ctrl+C in the terminal where turbo dev is running
```

---

## Part 6: Next Steps (Recommended)

### 6.1 Integrate HeroUI Components

Once Turborepo is running, the next logical step is to add HeroUI (a modern React component library) to `apps/web`:

**Why HeroUI?**

- Modern, accessible components
- Built with Tailwind CSS + React
- Pairs perfectly with Turborepo + Next.js
- Ideal for "dashboard feel" projects

**High-level steps (detailed guide separate):**

1. Install HeroUI package in `apps/web`
2. Configure Tailwind v4 in the Next.js app
3. Wrap your root layout in `HeroUIProvider`
4. Use HeroUI components in your pages

### 6.2 Add a Vite App (Optional)

The template starts with Next.js. If you want a fast, lightweight Vite React app:

1. Create a new app in `apps/` using `bunx create-vite@latest`
2. Update `turbo.json` to include the new app in the `dev` task
3. The proxy will automatically route requests to the new app

### 6.3 Add Observability (Optional)

For production-grade development, consider the `with-otel` Turborepo example (adds Prometheus + Grafana monitoring). This is a separate setup, but integrates cleanly with your monorepo.

### 6.4 Commit to Git

If you haven't already, initialize Git and make your first commit:

```shell
git init
git add .
git commit -m "Initial Turborepo with-microfrontends setup"
```

---

## Part 7: Troubleshooting & Common Pitfalls

### Problem: `nvm: command not found` after installing nvm

**Cause:** nvm installation script didn't properly source zsh.

**Fix:**

```shell
# Manually add nvm to ~/.zshrc
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.zshrc
source ~/.zshrc

# Verify
nvm --version
```

### Problem: `which node` shows `/mnt/c/Program Files/nodejs/node.exe`

**Cause:** Windows Node is leaking into your WSL PATH.

**Fix:**

```shell
# Check what's in your PATH
echo $PATH

# Remove Windows paths from ~/.zshrc
# Look for any lines with C:\, Program Files, or /mnt/c
# Delete those lines, then:
source ~/.zshrc

# Verify the new node
which node
# Should now show /home/wsl-vm/.nvm/...
```

### Problem: VS Code says "WSL: Ubuntu" but terminal is PowerShell

**Cause:** VS Code is in remote WSL mode, but the terminal defaulted to PowerShell.

**Fix:**

Add this to your VS Code settings (File → Preferences → Settings, then search "terminal integrated default"):

```json
"terminal.integrated.defaultProfile.linux": "zsh"
```

Or edit `.vscode/settings.json` in your project:

```json
{
  "terminal.integrated.defaultProfile.linux": "zsh"
}
```

### Problem: `bun install` shows conflicts or hangs

**Cause:** Multiple lockfiles exist (e.g., `yarn.lock` and `package-lock.json` from a prior setup).

**Fix:**

```shell
# If the scaffold created bun.lock but you have old lockfiles
rm -f package-lock.json yarn.lock pnpm-lock.yaml

# Clean and reinstall
bun install
```

### Problem: `localhost:3024` shows a blank page or 404

**Cause:** The proxy started but the app didn't fully load, or the port is wrong.

**Fix:**

```shell
# Check what's running on 3024
lsof -i :3024   # If available
# OR check the turbo dev output for errors

# Restart turbo dev with more verbose output
bunx turbo dev --verbose
```

### Problem: "This is the exact trap..." — VS Code opened from Windows and I can't tell

**Cause:** You accidentally opened VS Code from Windows Explorer or File menu.

**Check these three things:**

1. **Bottom-left corner** — Does it say "WSL: Ubuntu"? If not, you're in Windows mode.
2. **Terminal type** — Open integrated terminal. Does it show `PowerShell` or `zsh`? PowerShell = Windows mode.
3. **Node path** — `which node`. Does it show `/home/...` or `/mnt/c/.../node.exe`? The latter means Windows.

**Fix:** Close VS Code completely, open a WSL terminal, navigate to your project, type `code .`, and verify all three checks pass.

### Problem: My OneDrive is syncing node_modules

**Cause:** You're developing in a OneDrive-synced folder (e.g., `C:\Users\<You>\OneDrive\Documents\...`).

**Fix:** This guide assumes you're **only** developing inside WSL (under `/home/...`). Files inside WSL are invisible to OneDrive by default. Move your project:

```shell
# INSIDE WSL:
mkdir -p ~/projects/claude
mv /mnt/c/Users/<You>/OneDrive/my-project ~/projects/claude/my-project
# Then reopen VS Code from: ~/projects/claude/my-project
```

### Problem: `bunx create-turbo` asks for a template option I didn't see

**Cause:** Your version of `create-turbo` might prompt differently.

**Fix:** You can always specify the template directly:

```shell
bunx create-turbo@latest --example with-microfrontends
```

This bypasses the interactive prompts.

---

## Part 8: Golden Rules Checklist (Printable)

Print this page, laminate it, keep it on your desk. Review it daily until these rules become muscle memory.

### The 5 Non-Negotiable Rules

**🟢 Rule 1: If it starts with `/mnt`, stop.**

- Your project folder **must** start with `/home`
- Never develop in `/mnt/c` or anywhere under Windows paths
- Treat `/mnt` as read-only storage, not working directory

**🟢 Rule 2: VS Code must say "WSL: Ubuntu" (bottom-left)**

- If it doesn't, close VS Code
- Reopen from WSL terminal with `code .`
- This is non-negotiable

**🟢 Rule 3: Which node must never end in `.exe`**

- `which node` must show `/home/wsl-vm/.nvm/...`
- If you see `/mnt/c/...` or `.exe`, Windows has leaked in
- Fix your PATH and restart

**🟢 Rule 4: Open VS Code ONLY from WSL terminal**

- Command: `cd ~/projects/claude/my-project && code .`
- Never: Windows Explorer → Open with VS Code
- Never: VS Code → File → Open Folder (from Windows)

**🟢 Rule 5: All development happens inside `/home`**

- `/home/wsl-vm/projects/claude/...` ✅
- `/mnt/c/Users/...` ❌
- `C:\Users\...` ❌

### Weekly Sanity Check

Run this weekly:

```shell
pwd          # Must show /home/wsl-vm/projects/claude/...
which node   # Must show /home/wsl-vm/.nvm/... (no .exe)
echo $SHELL  # Must show /bin/zsh
```

If all three are ✅, your setup is clean.

---

## How to Use These Three Documents

When you need help, use this quick routing guide:

- **WSL-Turborepo-Setup-Guide.md** (this file) → First-time setup, step-by-step walkthrough
- **WSL-Golden-Rules.md** → Daily reference; print & keep visible; weekly sanity check
- **WSL-Troubleshooting-Guide.md** → When something breaks; searchable by symptom

---

## Appendix: Resources & References

### Official Documentation (Bookmark These)

- **Turborepo with-microfrontends example:** <https://github.com/vercel/turborepo/tree/main/examples/with-microfrontends>
- **Turborepo docs (full):** <https://turborepo.org/docs/getting-started>
- **Bun package manager:** <https://bun.sh/docs/package-manager>
- **Bun CLI reference:** <https://bun.sh/docs/cli>
- **nvm (Linux/Mac):** <https://github.com/nvm-sh/nvm#readme>
- **Microsoft WSL:** <https://learn.microsoft.com/en-us/windows/wsl/>
- **WSL file access from Windows:** <https://learn.microsoft.com/en-us/windows/wsl/file-systems>
- **VS Code Remote - WSL:** <https://marketplace.visualstudio.com/items?itemName=ms-vscode.remote-wsl>

### Key Decision Points Explained

**Why WSL instead of native Windows Node?**

- ✅ OneDrive never interferes (files in `/home` are invisible to OneDrive)
- ✅ Linux-native tooling (npm, build systems) work exactly as documented
- ✅ Easier to match CI/CD environments (which typically run Linux)
- ❌ Small startup overhead (usually <1 second)

**Why Bun instead of npm/yarn?**

- ✅ 2–3x faster install and execution
- ✅ Single binary (no separate node-gyp, no separate npx)
- ✅ `bunx` works great with Turborepo
- ❌ Smaller ecosystem (fewer third-party packages tested with Bun)

**Why with-microfrontends template?**

- ✅ Official Turborepo example (well-maintained)
- ✅ Multi-app proxy at single port (localhost:3024) — perfect for local dashboards
- ✅ Shared packages folder (components, utilities, etc.)
- ❌ Includes Next.js by default (you'll need to learn Next.js or replace with Vite apps)

---

## Appendix: Quick Reference Commands

### Everyday Commands

```shell
# Navigate to your monorepo
cd ~/projects/claude/turbo-lab

# Start all apps (one command)
bunx turbo dev

# Install a new package in the root
bun add some-package

# Install a package only in apps/web
cd apps/web
bun add some-package

# Run a custom Turborepo task
bunx turbo run build
bunx turbo run test

# Check what Turborepo tasks are available
cat turbo.json
```

### Debugging Commands

```shell
# Verify Node + nvm
which node
node -v
nvm list

# Verify Bun
which bun
bun --version

# Check your path
echo $PATH

# Check you're in WSL, not Windows
pwd
uname -a  # Should show Linux
```

### Cleanup & Reset (Use Carefully)

```shell
# Delete and recreate Turborepo (use if severely broken)
cd ~/projects/claude
rm -rf turbo-lab
bunx create-turbo@latest -e with-microfrontends  # Then answer prompts

# Clear Bun cache (if install is stuck)
bun cache clear

# Clear npm cache (rarely needed, but available)
npm cache clean --force
```

---

## How to Use This Guide

1. **First time setup:** Read Part 1–5 in order, running commands as you go.
2. **Troubleshooting:** Jump to Part 7, find your error, follow the fix.
3. **Daily development:** Keep Part 8 (Golden Rules) visible. Check it weekly.
4. **Next steps:** Read Part 6 when Turborepo is running and you want to extend it.

---

**Last updated:** 2026-05-03  
**Based on:** Copilot conversation with user, WSL + Node + Bun + Turborepo workflow  
**Feedback / corrections:** Update the source conversation and regenerate this guide.
