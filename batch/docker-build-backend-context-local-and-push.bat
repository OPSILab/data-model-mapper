cd ..
docker compose -f docker-compose-context-local.yml build data-model-mapper-backend
docker push engineeringopsilab/data-model-mapper-backend
pause