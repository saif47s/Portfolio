FROM node:20-slim

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies (including devDependencies for building)
RUN npm install

# Copy all project files
COPY . .

# Build the project
RUN npm run build

# Expose the port Hugging Face expects (7860)
EXPOSE 7860

# Set environment variables
ENV NODE_ENV=production
ENV PORT=7860

# Start the application
CMD ["npm", "start"]
