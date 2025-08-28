# Use Node.js LTS
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install -g nodemon && npm install

# Copy the rest of the server files
COPY . .

# Expose backend port
EXPOSE 8080

# Run with hot-reload (nodemon)
CMD ["npx", "nodemon", "index.js"]
