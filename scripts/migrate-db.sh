mysql_root_password=testdbpass
migration_file=$(dirname ${0})/../snapshots/db/db.sql
container_name=betakatcom-db-dev

docker exec -i $container_name sh -c "exec mysql -uroot -p\"$mysql_root_password\"" < $migration_file