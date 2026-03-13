#!/bin/bash
set -e

echo "🚀 n8n AI Starter Kit - Codespaces Setup"
echo "=========================================="

# Check Docker availability
echo "✅ Checking Docker..."
docker --version
docker compose --version

# Generate .env from .env.codespaces using runtime env vars (if present)
if [ -f scripts/generate-env.sh ]; then
  bash scripts/generate-env.sh .env.codespaces .env || true
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

echo ""
echo "✅ Setup Complete!"
echo "=========================================="
echo "📋 Next steps:"
echo "  1. Run: docker compose --profile cpu up -d"
echo "  2. Wait 60+ seconds for services to start"
echo "  3. Open n8n: http://localhost:5678"
echo "=========================================="
