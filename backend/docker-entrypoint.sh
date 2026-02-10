#!/bin/sh
# docker-entrypoint.sh

# Se config.js non esiste, crealo
if [ -f /app/config.js ]; then
  cp /app/config.js /app/config.js.bak
  sed 's/localhost/host.docker.internal/g' /app/config.js.bak > /app/config.js
fi

# Avvia l'app
exec npm start
