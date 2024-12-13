# Use Node.js LTS version
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source and public directory
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]
