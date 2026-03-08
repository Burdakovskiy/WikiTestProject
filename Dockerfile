FROM mcr.microsoft.com/playwright:v1.58.2-jammy

ENV LANG=C.UTF-8
ENV TZ=Europe/Berlin

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npm", "run", "test"]