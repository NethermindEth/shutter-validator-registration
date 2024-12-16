# Use a Node.js base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy all files into the container
COPY . .

# Install dependencies
RUN npm install

# Build the production files
RUN npm run build

# Serve the app
EXPOSE 3000
CMD ["npm", "start"]
