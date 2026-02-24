cd ..
docker compose -f docker-compose-context-local-non-latest.yml build data-model-mapper-backend
docker push engineeringopsilab/data-model-mapper-backend:dev
pause