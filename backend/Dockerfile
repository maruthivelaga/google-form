FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copy backend source
COPY backend/src ./src
COPY backend/scripts ./scripts

# Copy data files for seeding (Excel files)
COPY data ./data

# Copy database schema
COPY database ./database

EXPOSE 5000

CMD ["node", "src/server.js"]
