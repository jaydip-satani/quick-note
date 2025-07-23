FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies
RUN apt-get update && \
    apt-get install -y curl gnupg git build-essential python3 && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean

# Enable Corepack and activate Yarn v3.2.3
RUN corepack enable && corepack prepare yarn@3.2.3 --activate

# Set working directory
WORKDIR /app

# Copy relevant files needed for install
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn

# Install dependencies
RUN yarn install --immutable

# Copy rest of the app
COPY . .

# Build Next.js app
RUN yarn build

# Expose Next.js port
EXPOSE 3000

# Start app
CMD ["yarn", "start"]
