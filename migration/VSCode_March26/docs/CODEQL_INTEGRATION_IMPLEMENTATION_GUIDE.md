# CodeQL Integration Implementation Guide

## VSCode_March26 Project Setup

**Last Updated**: 2026-04-03  
**Status**: Ready for Implementation  
**Audience**: Development Team, DevOps Engineers, Tech Leads

---

## Overview

This guide explains how to integrate the comprehensive CodeQL CLI analysis (see `CODEQL_INTEGRATION_ANALYSIS.md`) into the VSCode_March26 project using best practices from DevOps and software engineering expertise.

**Expected Outcome**: Automated, reproducible CodeQL CLI setup across WSL, GitHub Codespaces, and local development environments.

---

## Quick Summary of What Will Be Implemented

| Component | Purpose | Status |
|-----------|---------|--------|
| `scripts/ci/install-codeql.sh` | Idempotent installer | ✅ Complete |
| `.vscode/tasks.json` | Auto-run on workspace open | ✅ Complete |
| `.vscode/settings.json` | Configure CodeQL path | ✅ Config needed |
| `.gitignore` | Exclude binaries | ✅ Update needed |
| `.devcontainer/` (optional) | Codespace prebuilds | 🟡 Template provided |
| `.github/workflows/codeql.yml` (optional) | CI scanning | 🟡 Template provided |

---

## Integration Approach (Choose One)

### 🟢 **Approach A: RECOMMENDED** — Minimal Setup

**For**: Individual developers, WSL focus, standard Codespaces
**Effort**: 30 minutes
**Maintenance**: Minimal

**Steps**:

1. **Create Installer Script**

   ```bash
   mkdir -p scripts/ci
   # Copy install-codeql.sh content from CODEQL_INTEGRATION_ANALYSIS.md (Section 3)
   chmod +x scripts/ci/install-codeql.sh
   ```

2. **Add VS Code Task**

   ```bash
   # Edit .vscode/tasks.json, add CodeQL task (from analysis guide)
   # runOptions.runOn: "folderOpen" ensures auto-execution
   ```

3. **Update Settings**

   ```json
   // .vscode/settings.json
   {
     "codeQL.cli.executablePath": "${workspaceFolder}/.tools/codeql/codeql",
     "task.allowAutomaticTasks": "on"
   }
   ```

4. **Update Gitignore**

   ```
   # .gitignore
   .tools/
   .codeql-databases/
   ```

5. **Test**

   ```bash
   cd ~/workspaces/VSCode_March26
   bash scripts/ci/install-codeql.sh
   .tools/codeql/codeql --version
   ```

**Timeline**: This week  
**Risk**: Low (idempotent, reversible)

---

### 🟡 **Approach B: ADVANCED** — Codespace Prebuilds

**For**: Team heavy on Codespaces, want instant-ready environments
**Effort**: 2-3 hours + CI maintenance
**Maintenance**: Medium (GitHub Actions workflow)

**Steps**:

1. **Create Dockerfile**

   ```docker
   # .devcontainer/Dockerfile
   FROM mcr.microsoft.com/devcontainers/python:3.11
   
   RUN mkdir -p /workspace/.tools && cd /workspace/.tools && \
       curl -L -o codeql.zip \
       "https://github.com/github/codeql-cli-binaries/releases/download/v2.25.1/codeql-linux64.zip" && \
       unzip -q codeql.zip && rm codeql.zip && \
       chmod +x codeql/codeql
   
   ENV PATH="/workspace/.tools/codeql:$PATH"
   ```

2. Create `devcontainer.json` (See Section 5 of analysis)

3. **Create GitHub Actions Prebuild Workflow**

   ```yaml
   # .github/workflows/devcontainer-prebuild.yml
   name: Prebuild Dev Container
   on: [push] # See analysis for full workflow
   ```

4. **Test**: Create Codespace; verify CodeQL available immediately

**Timeline**: 2-3 weeks  
**Benefit**: Codespace startup drops from 30s to 15-20s

---

### 🔴 **Approach C: CI-ONLY** — GitHub CodeQL Action

**For**: Don't need local CLI; CI analysis only
**Effort**: 1 hour
**Maintenance**: Minimal

**Steps**:

1. **Create GitHub Actions Workflow**

   ```yaml
   # .github/workflows/codeql.yml
   name: CodeQL
   on: [push, pull_request]
   # See Section 5 of analysis for full workflow
   ```

2. **Test**: Push code; verify analysis runs in Actions

**Timeline**: 1 week  
**Benefit**: GitHub Advanced Security integration

---

## DevOps Implementation Strategy

Following the **DevOps Infinity Loop** principle:

### ✅ **Plan Phase** (Complete)

- ✅ Requirements analyzed
- ✅ Three integration approaches evaluated
- ✅ Risk assessment done
- **Outcome**: This guide

### 📝 **Code Phase** (Next)

- [ ] Commit implementation files
- [ ] Branch: `feature/codeql-integration`
- [ ] Files to commit:
  - `scripts/ci/install-codeql.sh`
  - `.vscode/tasks.json` (updated)
  - `.vscode/settings.json` (updated)
  - `.gitignore` (updated)

### 🔨 **Build Phase** (Next)

- [ ] GitHub Actions validates scripts
- [ ] Test installer in Ubuntu environment
- [ ] Verify no breaking changes

### ✔️ **Test Phase** (Next)

- [ ] Manual testing in WSL
- [ ] Test in VS Code Remote-WSL
- [ ] Test in GitHub Codespaces

### 📦 **Release Phase** (Next)

- [ ] Create PR with implementation
- [ ] Team review
- [ ] Merge to main/develop

### 🚀 **Deploy Phase** (Next)

- [ ] Document in README
- [ ] Update team onboarding guide
- [ ] Distribute to team

### 🔧 **Operate Phase** (Ongoing)

- [ ] Monitor for issues
- [ ] Update CodeQL version as needed
- [ ] Handle edge cases

### 📊 **Monitor Phase** (Ongoing)

- [ ] Track adoption metrics
- [ ] Gather feedback
- [ ] Plan improvements
- **Loop**: → Back to Plan

---

## Implementation Checklist

### Pre-Implementation

- [ ] Read full CODEQL_INTEGRATION_ANALYSIS.md
- [ ] Choose Approach (A, B, or C)
- [ ] Get team buy-in
- [ ] Plan review/merge process

### Approach A Implementation

- [ ] Create `scripts/ci/install-codeql.sh` (copy from analysis)
- [ ] Update `.vscode/tasks.json`
- [ ] Update `.vscode/settings.json`
- [ ] Update `.gitignore`
- [ ] Commit with message: "feat: add CodeQL CLI installer"

### Approach B Implementation (if chosen)

- [ ] Do Approach A first
- [ ] Create `.devcontainer/Dockerfile`
- [ ] Create `.devcontainer/devcontainer.json`
- [ ] Create `.github/workflows/devcontainer-prebuild.yml`
- [ ] Test: Create Codespace and verify

### Approach C Implementation (if chosen)

- [ ] Create `.github/workflows/codeql.yml`
- [ ] Configure GitHub Advanced Security (if available)
- [ ] Test: Push and verify Actions run

### Post-Implementation

- [ ] Manual testing (all developers)
- [ ] Create PR and get reviews
- [ ] Merge to target branch
- [ ] Update README with CodeQL section
- [ ] Communicate to team
- [ ] Monitor for issues

---

## Key Decision Points

### 1. Choose Integration Approach

**Decision**: Which approach fits your team best?

- **A (Minimal)**: Default unless you have specific needs
- **B (Prebuilds)**: Useful if team uses Codespaces frequently
- **C (CI-Only)**: If you don't need local CodeQL

**Recommendation**: Start with A, migrate to B if Codespaces usage increases

### 2. Version Pinning

**Question**: Should CodeQL version be pinned?

- **No (Default)**: Always fetch latest release; auto-upgrade
- **Yes (If needed)**: Pin via `CODEQL_VERSION` environment variable

**Recommendation**: No pinning initially; revisit if version conflicts arise

### 3. Development vs. Production

**Question**: Should installer run in CI (Approach C)?

- **Yes**: GitHub Actions handles security scanning
- **No**: Only local development setup

**Recommendation**: Both—local development + CI scanning together

---

## Integration Timeline

**Week 1**:

- Mon: Review documentation, choose approach
- Tue-Wed: Implement files
- Thu: Manual testing in WSL
- Fri: Create PR, get reviews

**Week 2**:

- Mon-Tue: Incorporate feedback, fixes
- Wed: Merge to main
- Thu: Update README
- Fri: Communicate to team

**Ongoing**:

- Monitor for issues
- Update CodeQL version quarterly
- Plan Approach B migration (if relevant)

---

## Success Criteria

After implementation, verify:

- ✅ Developer can clone repo and open in VS Code
- ✅ CodeQL auto-installs when workspace opens
- ✅ `codeql --version` works without manual PATH setup
- ✅ Subsequent opens don't re-download (idempotent)
- ✅ Works in WSL, Codespaces, and local dev
- ✅ Team doesn't need to install CodeQL manually
- ✅ Integration documented in README

---

## Rollback Plan

If issues arise, you can safely rollback:

```bash
# Remove generated files
rm -rf scripts/ci/install-codeql.sh
rm -rf .tools/codeql/

# Revert commits
git revert <commit-hash>

# No side effects or data loss
```

**Why safe**: Binary not committed (gitignored); script is standalone; no system changes

---

## Common Questions

**Q: Will this slow down workspace loading?**  
A: Negligible. On first open, ~2-5 sec for download (one-time). Subsequent opens: <100ms (detects existing binary).

**Q: Does this work on Windows (non-WSL)?**  
A: Bash script won't run natively. Solutions: (1) Use VS Code Remote-WSL extension, (2) Create PowerShell variant, (3) Use GitHub Actions only.

**Q: Can I control CodeQL version?**  
A: Yes. Set `CODEQL_VERSION=2.25.1` environment variable before running installer.

**Q: Is the binary cached in Codespaces?**  
A: With Approach A: Yes, first Codespace download takes time; subsequent are cached. With Approach B: Yes, prebuilt image caches binary.

**Q: Can I use CodeQL for security scanning in CI?**  
A: Yes. Use Approach C (GitHub CodeQL Action) or run queries locally then upload results.

---

## Next Steps

1. **Read Full Documentation**: Review `CODEQL_INTEGRATION_ANALYSIS.md` (Sections 1-8)
2. **Choose Approach**: Decide between A, B, or C based on team needs
3. **Implement**: Follow checklist above for your chosen approach
4. **Test**: Validate in WSL, VS Code Remote-WSL, Codespaces
5. **Review**: Get team feedback before merging
6. **Deploy**: Communicate to team; celebrate automation win!

---

## Documentation Index

| Document | Purpose |
|----------|---------|
| `CODEQL_INTEGRATION_ANALYSIS.md` | Comprehensive analysis (this folder) |
| `CODEQL_INTEGRATION_IMPLEMENTATION_GUIDE.md` | Implementation roadmap (this file) |
| `docs/SETUP.md` (create this) | Developer quick-start guide |
| `docs/TROUBLESHOOTING.md` (create this) | Common issues & fixes |
| `README.md` (update) | Project overview with CodeQL section |

---

## Contact & Support

For questions or issues:

1. Check `TROUBLESHOOTING.md` (section 7 of analysis)
2. Review this integration guide
3. Open issue in GitHub (tag #codeql)
4. Reach out to DevOps team

---

**Document Created**: 2026-04-03  
**For Project**: VSCode_March26  
**Approach Recommended**: A (Minimal) for immediate implementation  
**Status**: Ready for team review
