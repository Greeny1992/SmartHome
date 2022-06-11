FROM node:13-alpine as build
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
RUN npm run-script build
FROM bitnami/nginx:1.22
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/build/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
EXPOSE 443
# Start nginx
CMD ["nginx", "-g", "daemon off;"]