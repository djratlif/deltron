# Production Multi-stage Dockerfile for Google Cloud Run
FROM node:20-alpine AS runner

WORKDIR /app

# Install production dependencies
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund

# Copy application files
COPY . .

# Environment Defaults
ENV NODE_ENV=production
ENV PORT=8080
ENV ACCESS_CODE=3030

EXPOSE 8080

CMD ["node", "server.js"]
