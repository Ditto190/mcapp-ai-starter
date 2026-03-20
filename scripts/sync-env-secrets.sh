#!/usr/bin/env bash
# Smart environment secrets synchronization
# Automatically detects and syncs new/changed keys from .env to GitHub Codespaces secrets
# Usage: bash scripts/sync-env-secrets.sh [--dry-run] [--verbose]

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Options
DRY_RUN=false
VERBOSE=false
ENV_FILE=".env"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run) DRY_RUN=true; shift ;;
    --verbose) VERBOSE=true; shift ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

# Check if .env exists
if [ ! -f "$ENV_FILE" ]; then
  echo -e "${RED}❌ Error: $ENV_FILE not found${NC}"
  exit 1
fi

# Check if gh CLI is available
if ! command -v gh &> /dev/null; then
  echo -e "${YELLOW}⚠️  GitHub CLI (gh) not found${NC}"
  echo ""
  echo "Install it:"
  echo "  macOS:  brew install gh"
  echo "  Linux:  apt install gh"
  exit 1
fi

# Verify gh authentication
if ! gh auth status &> /dev/null; then
  echo -e "${RED}❌ GitHub CLI not authenticated${NC}"
  echo "Run: gh auth login"
  exit 1
fi

echo -e "${BLUE}🔄 Syncing environment secrets...${NC}"
echo ""

# Variables to track
NEW_KEYS=0
SKIPPED_KEYS=0
ERRORS=0

# Get all keys from .env
declare -A env_keys
while IFS= read -r line || [ -n "$line" ]; do
  [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue
  if [[ "$line" =~ ^([A-Za-z_][A-Za-z0-9_]*)= ]]; then
    key="${BASH_REMATCH[1]}"
    value="${line#*=}"
    env_keys["$key"]="$value"
  fi
done < "$ENV_FILE"

# Get existing secrets from GitHub Codespaces
echo -e "${BLUE}📋 Fetching existing Codespaces secrets...${NC}"
existing_secrets=$(gh secret list --app codespaces 2>/dev/null | tail -n +2 | awk '{print $1}' || true)

# Track which secrets we've seen
declare -A secret_exists
for secret in $existing_secrets; do
  secret_exists["$secret"]=1
done

# Process each key from .env
for key in "${!env_keys[@]}"; do
  value="${env_keys[$key]}"
  
  # Check if secret already exists
  if [[ -v secret_exists["$key"] ]]; then
    [[ "$VERBOSE" == true ]] && echo -e "${YELLOW}⏭️  $key (exists, skipping)${NC}"
    ((SKIPPED_KEYS++))
  else
    # New secret - needs to be added
    echo -e "${GREEN}✨ NEW: $key${NC}"
    
    if [ "$DRY_RUN" == true ]; then
      echo "   [DRY RUN] Would set: gh secret set $key --body '***masked***'"
      ((NEW_KEYS++))
    else
      if echo "$value" | gh secret set "$key" 2>&1 > /dev/null; then
        echo -e "${GREEN}✓ Set $key${NC}"
        ((NEW_KEYS++))
      else
        echo -e "${RED}✗ Failed to set $key${NC}"
        ((ERRORS++))
      fi
    fi
  fi
done

# Summary
echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${GREEN}📊 SYNC SUMMARY:${NC}"
echo -e "  ${GREEN}✨ New keys:${NC}     $NEW_KEYS"
echo -e "  ${YELLOW}⏭️  Skipped:${NC}      $SKIPPED_KEYS"
echo -e "  ${RED}❌ Errors:${NC}       $ERRORS"
echo ""

if [ $NEW_KEYS -gt 0 ]; then
  echo -e "${GREEN}✅ Successfully synced $NEW_KEYS new secret(s)${NC}"
  echo "   Restart or rebuild your Codespace to load new secrets"
elif [ $SKIPPED_KEYS -gt 0 ]; then
  echo -e "${YELLOW}✓ All secrets already synced${NC}"
fi
echo ""

exit $([ $ERRORS -eq 0 ] && echo 0 || echo 1)
