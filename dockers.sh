#docker build -t origins-linux .

#docker run --rm -P -p 3000:3000 -p 5432:5432 --name origins-docker origins-linux

#TODO at this writing this is just a scratch pad of commands - convert to useful, argumented script

docker compose build
docker compose up

curl -d '"body":{"description":"test-description", "url":"http"}' -X POST http://localhost:3000/video

curl -X POST http://localhost:3000/video -H "Content-Type: application/json" -d "{ \"description\": \"test-description\",\"url\": \"test-http\",\"name\": \"test-name\" }"

curl --header "Content-Type: application/json" --request POST --data '{"description":"test-description", "url":"http", "name":"test-name"}' http://localhost:3000/video

curl -X json" -d "{ \"description\": \"test-description\",\"url\": \"test-http\",\"name\": \"test-name\" }" http://localhost:3000/video

docker build -f DockerPostgres -t pg_container .
docker run --rm -P -p 5432:5432 --name pg_container