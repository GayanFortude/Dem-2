# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:latest as build

# Set the working directory
WORKDIR /app

# Add the source code to app
COPY  package.json package-lock.json ./

# Install all the dependencies
RUN npm install --f
COPY . .

# Generate the build of the application
RUN npm run build -- --configuration production

# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build app/dist/my-standalone-app/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
# Expose port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]