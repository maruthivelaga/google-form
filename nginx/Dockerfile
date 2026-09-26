FROM node:20-alpine AS builder

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# --- Final nginx image ---
FROM nginx:alpine

# Copy built frontend to nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html/data-form

# Copy nginx config
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
