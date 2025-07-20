# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies based on lock file
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy rest of the project
COPY . .

# Build the Next.js app
RUN yarn build

# Expose port Next.js will run on
EXPOSE 3000

# Start the production server
CMD ["yarn", "start"]
