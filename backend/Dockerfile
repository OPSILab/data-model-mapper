FROM node:16-bullseye
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN date > /app/date.txt
RUN sed -i 's/localhost/host.docker.internal/g' /app/config.js
RUN apt-get update && apt-get install -y gnupg \
 && wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | apt-key add - \
 && echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/debian bullseye/mongodb-org/7.0 main" \
      | tee /etc/apt/sources.list.d/mongodb-org-7.0.list \
 && apt-get update && apt-get install -y mongodb-mongosh \
 && rm -rf /var/lib/apt/lists/*
CMD ["node", "mapper"]