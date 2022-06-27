image_name=betakatcom-db
image_tag=dev
container_name=betakatcom-db-dev
dockerfile=dockerfile.db.dev
volume_name=betakatcom-db
db_port=3306

if [ -z "$(docker images -q $image_name:$image_tag)" ]; then
  docker build -t $image_name:$image_tag -f $dockerfile .
fi

if [[ "$(docker volume ls -q)" != *"$volume_name"* ]]; then
    docker volume create $volume_name
    need_migration=true
fi
containerID=$(docker ps -aqf "name=$container_name")

if [ -z "$containerID" ]; then
    docker run -d --name $container_name -v $volume_name:/var/lib/mysql -p $db_port:$db_port $image_name:$image_tag
else
    docker start $container_name
fi

