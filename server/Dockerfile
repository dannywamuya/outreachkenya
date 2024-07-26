# Use the official Bun image
FROM oven/bun:1

# Set the working directory
WORKDIR /usr/src/app

# Set environment variables
ENV PORT 8080
ENV HOST 0.0.0.0

# Copy dependency files and install dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile --production

# Copy the rest of the application code
COPY . .

# Start the application
CMD ["bun", "start"]