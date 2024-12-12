# Stage 1: Build the React app
FROM --platform=linux/amd64 node:18-alpine AS build

RUN apt-get update && apt-get install -y curl wget && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code (including config files)
COPY . ./

# Build the app
RUN npm run build

# Stage 2: Serve the React app with Nginx
FROM --platform=linux/amd64 nginx:stable-alpine

# Copy the build output to Nginx's html directory
COPY --from=build /app/dist /usr/share/nginx/html


# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
