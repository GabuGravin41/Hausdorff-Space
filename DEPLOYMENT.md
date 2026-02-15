# Vercel Deployment Configuration
# This file is automatically read by Vercel to configure the deployment

# Build settings
buildCommand = "npm run build"
outputDirectory = "dist"

# Node.js version
[env]
  NODE_VERSION = "18"

# Serverless function configuration
[functions]
  node = "18.x"

# API routes are automatically detected from the /api directory
# No additional configuration needed for /api/openrouter.ts

# Rewrites and redirects (if needed in the future)
# [[redirects]]
#   source = "/old-path"
#   destination = "/new-path"
#   permanent = true
