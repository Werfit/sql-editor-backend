# Stage 1: Build the application
FROM node:18 as build

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --dev

# Copy the application source code
COPY . .

# Build the application
RUN pnpm build

# Stage 2: Create production image
FROM node:18-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /usr/src/app

# Copy the build output and install only production dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

COPY --from=build /usr/src/app/dist ./dist

# Copy entrypoint script
COPY entrypoint.sh /usr/src/app/entrypoint.sh

# Make entrypoint script executable
RUN chmod +x /usr/src/app/entrypoint.sh

# Expose application port
EXPOSE 3000

# Define the entrypoint script
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]

# Set the default command
CMD ["node", "dist/main.js"]