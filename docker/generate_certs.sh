#!/bin/bash

echo "Create a directory named certs in the same location as your docker-compose.yml file:"
mkdir certs

echo "Generate the CA certificate and key:"
cockroach cert create-ca --certs-dir=certs --ca-key=certs/ca.key

echo "Generate the node certificate and key:"
cockroach cert create-node localhost $(hostname) cockroachdb --certs-dir=certs --ca-key=certs/ca.key

echo "Generate the client certificate and key:"
cockroach cert create-client root --certs-dir=certs --ca-key=certs/ca.key

echo "Ensure that the certificates have the correct permissions and ownership:"
chmod 700 certs
chmod 600 certs/ca.key
