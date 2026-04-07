# Stage 1: Build Angular application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files and build
COPY . .
RUN npm run build --configuration=production

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf

# We copy the built files. Angular 17+ typically outputs to dist/<project-name>/browser
# For this project named frontEnd, it goes to /app/dist/frontEnd/browser
COPY --from=build /app/dist/frontEnd/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
