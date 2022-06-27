export MSYS_NO_PATHCONV=1

image_name=betakatcom-be
image_tag=dev
container_name=betakatcom-be-dev
dockerfile=dockerfile.dev
listen_port=5000
if [ -z "$(docker images -q $image_name:$image_tag)" ]; then
  docker build -t $image_name:$image_tag -f $dockerfile .
fi

containerID=$(docker ps -aqf "name=$container_name")

if [ -z "$containerID" ]; then
    docker run --name $container_name -v "$(pwd)":/app -p $listen_port:$listen_port $image_name:$image_tag
else
    docker start -a $container_name
fi

