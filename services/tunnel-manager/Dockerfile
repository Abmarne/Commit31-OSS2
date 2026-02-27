FROM node:18-alpine

WORKDIR /app

# Install cloudflared
RUN apk add --no-cache wget && \
    wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -O /usr/local/bin/cloudflared && \
    chmod +x /usr/local/bin/cloudflared && \
    apk del wget

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5003

CMD ["npm", "run", "dev"]
