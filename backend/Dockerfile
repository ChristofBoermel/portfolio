# Build Stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Force install of all dependencies (including devDependencies like typescript)
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
# Install only production dependencies
RUN npm install --omit=dev
# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist
# We also need .env if it's not injected, but usually env vars are injected by platform
# COPY .env .env 

EXPOSE 3000
CMD ["npm", "start"]
