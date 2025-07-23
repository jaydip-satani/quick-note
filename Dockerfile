# Dockerfile for a Next.js application using Yarn

# ---- Base Stage ----
# Use a specific Node.js version for reproducibility.
# Alpine Linux is used for its small size.
FROM node:20-alpine AS base
WORKDIR /app

# Enable Yarn by enabling corepack
RUN corepack enable


# ---- Dependencies Stage ----
# This stage is dedicated to installing dependencies.
# It will be cached by Docker unless dependency files change.
FROM base AS deps
WORKDIR /app

# Copy only the files needed to install dependencies
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# Install dependencies using Yarn.
# The --immutable flag ensures that yarn.lock is not modified, which is good practice for CI/CD.
RUN yarn install --immutable


# ---- Builder Stage ----
# This stage builds the Next.js application.
FROM base AS builder
WORKDIR /app

# Copy dependencies from the previous stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of your application's source code
COPY . .

# Build the Next.js application for production.
# This will create the .next folder with the build output.
RUN yarn build


# ---- Runner Stage ----
# This is the final, lightweight production image.
FROM base AS runner
WORKDIR /app

# Set the environment to production
ENV NODE_ENV production

# Create a non-root user and group for better security.
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# For optimal performance and small image size, it's highly recommended to
# enable Next.js's standalone output mode.
# Add the following to your next.config.js file:
#
# module.exports = {
#   output: 'standalone',
# };
#
# This creates a 'standalone' folder inside '.next' with only the necessary files.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to the non-root user
USER nextjs

# Expose the port the app will run on
EXPOSE 3000

# The command to start the Next.js server.
# The 'server.js' file is automatically created by the 'standalone' output mode.
CMD ["node", "server.js"]
