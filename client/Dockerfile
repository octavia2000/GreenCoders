# ---- Stage 1: Build ----
FROM node:20.19-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# ---- Stage 2: Serve ----
FROM nginx:alpine
# Copy built static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the Nginx HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]