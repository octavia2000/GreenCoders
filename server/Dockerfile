# ---- Stage 1: Build ----
FROM node:20.19-alpine AS builder

WORKDIR /app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code and build
COPY . .
RUN npm run build


# ---- Stage 2: Run ----
FROM node:20.19-alpine AS runner

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Expose NestJS default port
EXPOSE 3000

# Use production start command
CMD ["npm", "run", "start:prod"]