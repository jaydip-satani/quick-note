# Use official Node.js LTS image
FROM node:18-alpine

# Enable Corepack (comes with Node >=16.9+)
RUN corepack enable

# Set working directory
WORKDIR /app

# Copy only package files and install dependencies
COPY package.json yarn.lock ./

# Install dependencies using the correct Yarn version defined in package.json
RUN yarn install --frozen-lockfile

# Copy rest of the application
COPY . .

# Build the Next.js app
RUN yarn build

# Expose port for the Next.js app
EXPOSE 3000

# Start the Next.js production server
CMD ["yarn", "start"]
