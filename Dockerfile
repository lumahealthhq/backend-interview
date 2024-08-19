# Set ARGs that will be used across stages
ARG USER=node
ARG WORKSPACE=/home/$USER/app
ARG DUMB_INIT=/usr/local/bin/dumb-init
ARG DUMB_INIT_URL=https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_amd64

# Base stage
FROM node:20-alpine AS base
ARG WORKSPACE
ARG DUMB_INIT
ARG DUMB_INIT_URL

WORKDIR $WORKSPACE

# Install dumb-init
# DUMB_INIT is a minimal init system for Linux containers that will run as PID 1.
# Using it is recommend since otherwise the application (node.js) will run as process with PID 1
# Which can be problematic (cause instabilities) in Linux systems
ADD $DUMB_INIT_URL $DUMB_INIT
RUN chmod +x $DUMB_INIT

# Install latest npm globally
RUN npm install --location=global npm@latest

# Build stage
FROM base AS builder
ARG WORKSPACE

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies)
RUN npm ci

# Copy source files
COPY . .

# Install TypeScript globally (if not already in package.json)
RUN npm install -g typescript

# Run the build
RUN npm run build

# Production stage
FROM base AS production
ARG USER
ARG WORKSPACE

ENV NODE_PATH=.

# Install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built files from builder stage
COPY --from=builder $WORKSPACE/dist ./dist
COPY ./assets ./assets

# Set correct ownership
RUN chown -R $USER:$USER $WORKSPACE

USER $USER

EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "start"]
