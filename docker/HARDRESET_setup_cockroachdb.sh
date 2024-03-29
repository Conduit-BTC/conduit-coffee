#!/bin/bash

echo ">>>>>>> HARD RESET: CockroachDB Setup <<<"
echo ">>>>>"
echo ">>>"
echo ">"
echo " "

echo "Removing existing containers and volumes..."
docker-compose down -v
sleep 3

echo "Creating the certs directory..."
mkdir -p certs

echo "Generating security certificates..."
docker-compose run --rm cockroachdb cert create-node localhost --certs-dir /cockroach/certs --ca-key /cockroach/certs/ca.key
docker-compose run --rm cockroachdb cert create-client root --certs-dir /cockroach/certs --ca-key /cockroach/certs/ca.key

echo "Starting the CockroachDB container..."
docker-compose up -d

echo "Waiting for CockroachDB to be ready..."
sleep 3

echo "Initializing the CockroachDB cluster..."
docker-compose exec cockroachdb cockroach init --certs-dir /cockroach/certs --host=localhost

echo "Creating the admin user..."
docker-compose exec cockroachdb cockroach sql --certs-dir /cockroach/certs --host=localhost --execute="CREATE USER coffee_admin WITH PASSWORD 'your_password'; GRANT ADMIN TO coffee_admin;"

echo "Accessing the CockroachDB SQL shell securely..."
docker-compose exec cockroachdb cockroach sql --certs-dir /cockroach/certs --host=localhost --user=coffee_admin
