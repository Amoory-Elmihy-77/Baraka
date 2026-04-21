# ============================================
# Stage 1: Install production dependencies
# ============================================
FROM node:22-alpine AS deps

WORKDIR /app

# Copy only package files first for better layer caching
COPY package.json package-lock.json ./

# Install production dependencies only (no devDependencies like nodemon)
RUN npm ci --omit=dev

# ============================================
# Stage 2: Production image
# ============================================
FROM node:22-alpine AS production

# Add labels for image metadata
LABEL maintainer="Baraka Team"
LABEL description="Baraka Task & Academic Management API"

WORKDIR /app

# Copy production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source code
COPY package.json ./
COPY index.js ./
COPY config/ ./config/
COPY controllers/ ./controllers/
COPY middleware/ ./middleware/
COPY models/ ./models/
COPY routes/ ./routes/

# Create a non-root user for security
RUN addgroup -g 1001 -S appgroup && \
  adduser -S appuser -u 1001 -G appgroup

# Switch to non-root user
USER appuser

# Expose the application port
EXPOSE 5001

# Health check to verify container is running
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5001/ || exit 1

# Start the application
CMD ["node", "index.js"]
