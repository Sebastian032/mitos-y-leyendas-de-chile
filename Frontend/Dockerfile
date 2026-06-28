FROM node:20-slim

WORKDIR /app

# Copiamos e instalamos dependencias
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]