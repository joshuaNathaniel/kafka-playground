# Kafka Playground

## About
The playground is a quick demo of event driven microservices using Kafka by way of docker-compose.

## Getting Started
```shell
# start docker containers
yarn docker:start
# send an order
curl -X POST -H "Content-Type: application/json" localhost:3000/order -d "{}"
```
