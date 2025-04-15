FROM node:18-alpine AS builder

ARG USER
ARG DB_USER
ARG DB_PASSWORD
ARG DB_HOST
ARG DB_NAME
ARG PG_PORT

ENV USER=${USER}
ENV DB_USER=${DB_USER}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_HOST=${DB_HOST}
ENV DB_NAME=${DB_NAME}
ENV PG_PORT=5432


WORKDIR /app

COPY package.json ./

RUN npm install ../types  --install-links


COPY . .
EXPOSE 5001

CMD ["sh", "-c", "npm run dev"]