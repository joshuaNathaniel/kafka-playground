# Kafka Playground

## About
The playground is a quick demo of event driven microservices using Kafka by way of docker-compose.

## Getting Started
```shell
# Start docker containers
yarn docker:start
# Migrate database
yarn migrate
# Send an order
curl -X POST -H "Content-Type: application/json" localhost:3000/order -d "{
  \"quantity\": 1,
  \"productId\": 12345,
  \"customerName\": \"Foo Bar\",
  \"customerAddress\": \"123 Main St, Anytown, CA 12345\"
}"
```

## Development
```shell
# Install node version manager from  https://github.com/nvm-sh/nvm#installing-and-updating
nvm install
yarn install

# See root package.json for docker scripts to easily run the needed containers
```
