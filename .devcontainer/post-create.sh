#!/bin/bash
set -e

echo "🚀 n8n AI Starter Kit - Codespaces Setup"
echo "=========================================="

# Check Docker availability
echo "✅ Checking Docker..."
docker --version
docker compose --version

# Generate .env from .env.codespaces using runtime env vars + workspace .env fallback
if [ -f scripts/generate-env.sh ]; then
  echo "🔧 Generating .env from Codespaces secrets and template..."
  bash scripts/generate-env.sh .env.codespaces .env .env || true
fi

# Session initialization - load environment vars and setup hooks
if [ -f ".devcontainer/on-session-start.sh" ]; then
  echo "🚀 Running session initialization..."
  bash .devcontainer/on-session-start.sh
fi

# Create .env file from template if it doesn't exist
if [ ! -f .env ]; then
  echo "📝 Creating .env file..."
  cp .env.example .env
  
  # Generate secure secrets
  ENCRYPTION_KEY=$(openssl rand -base64 32)
  JWT_SECRET=$(openssl rand -base64 32)
  
  # Update secrets in .env (for non-production use)
  sed -i "s/N8N_ENCRYPTION_KEY=.*/N8N_ENCRYPTION_KEY=$ENCRYPTION_KEY/" .env
  sed -i "s/N8N_USER_MANAGEMENT_JWT_SECRET=.*/N8N_USER_MANAGEMENT_JWT_SECRET=$JWT_SECRET/" .env
  
  echo "✅ .env file created with secure keys"
else
  echo "✅ .env file already exists"
fi

# Create shared data folder
mkdir -p shared
chmod 777 shared

# Pre-pull images to save startup time
echo "📡 Pre-pulling Docker images (this may take 2-3 minutes)..."
docker pull n8nio/n8n:latest &
docker pull postgres:16-alpine &
docker pull ollama/ollama:latest &
docker pull qdrant/qdrant &
wait

# Install global npm packages for development tools
echo "📦 Installing global npm packages..."
npm install -g \
  genkit-cli \
  claude \
  claude-code \
  opencode
echo "✅ npm global packages installed"

# Install Python development tools
echo "📦 Installing Python development tools..."
python -m pip install --user \
  gh-cli \
  claude-code \
  opencode
echo "✅ Python packages installed"

echo ""
echo "✅ Setup Complete!"
echo "=========================================="
echo "📋 Next steps:"
echo "  1. Run: docker compose --profile cpu up -d"
echo "  2. Wait 60+ seconds for services to start"
echo "  3. Open n8n: http://localhost:5678"
echo "=========================================="
