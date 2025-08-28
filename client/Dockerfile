# Use Node.js LTS
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm install

# Copy the rest of the client files
COPY . .

# Expose frontend port
EXPOSE 5173

# Run Vite dev server with hot reload
CMD ["npm", "run", "dev", "--", "--host"]
