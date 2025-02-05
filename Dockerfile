# Stage 1: Build the React app
FROM --platform=linux/amd64 node:18-alpine AS frontend-build

# Set working directory
WORKDIR /frontend

# Copy package.json and package-lock.json
COPY Frontend/ui/package.json Frontend/ui/package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code (including config files)
COPY Frontend/ui/ ./

# Build the app
RUN npm run build

# Stage 2: Python FastAPI
FROM --platform=linux/amd64 python:3.11-slim AS backend

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /backend

# Copy requirements.txt
COPY Backend/requirements.txt .

# Install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the application code
COPY Backend/ ./

# Stage 3: Serve the React app with Nginx
FROM --platform=linux/amd64 nginx:stable-alpine

# Copy the build output to Nginx's html directory
COPY --from=frontend-build /frontend/dist /usr/share/nginx/html

# Expose Nginx port
EXPOSE 80

# Copy the backend application
COPY --from=backend /backend /backend

# Expose the FastAPI port
EXPOSE 8000

# Start both Nginx and FastAPI
CMD ["sh", "-c", "nginx -g 'daemon off;' & uvicorn backend.app.main:app --host 0.0.0.0 --reload --port 8000"]
