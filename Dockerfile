# Etapa 1 — Build de la app React con Node.js
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Etapa 2 — Servir el build con nginx
FROM nginx:stable-alpine

# Copiar los archivos estáticos generados por Vite
COPY --from=builder /app/dist /usr/share/nginx/html

# Config de nginx para que React Router funcione correctamente
RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
