# Frontend build stage
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Install frontend dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy frontend project files
COPY src/ ./src/
COPY public/ ./public/
COPY vite.config.ts tsconfig.json tsconfig.node.json tsconfig.app.json postcss.config.js tailwind.config.ts ./

# Build the frontend
RUN npm run build

# Backend build stage
FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
        build-essential \
        libpq-dev \
        curl \
        nginx \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY enap_backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend project files
COPY enap_backend/ .

# Copy built frontend files to backend static directory
COPY --from=frontend-builder /app/frontend/dist/ ./static/

# Make wait-for-it.sh executable
RUN chmod +x wait-for-it.sh

# Collect static files
RUN python manage.py collectstatic --noinput

# Configure nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose ports
EXPOSE 80

# Start both nginx and gunicorn
CMD ["sh", "-c", "nginx && gunicorn stockify.wsgi:application --bind 0.0.0.0:8000"]
