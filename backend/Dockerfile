FROM node:16-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN date > /app/date.txt
RUN sed -i 's/localhost/host.docker.internal/g' /app/config.js
CMD ["node", "mapper"]