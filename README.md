# Kafka Playground

## About
The playground is a quick demo of event driven microservices using Kafka by way of docker-compose.

## Getting Started
```shell
# Start docker containers
yarn docker:start
# Send an order
curl -X POST -H "Content-Type: application/json" localhost:3000/order -d "{
  \"quantity\": 1,
  \"productId\": 12345,
  \"customerName\": \"Foo Bar\",
  \"customerAddress\": \"123 Main St, Anytown, CA 12345\"
}"
# Some json should be returned with the orderId
curl localhost:3001/invoice/:orderId 
# Check the order shipped status is now true
curl localhost:3000/order/:id 
```

## Development
```shell
# Install node version manager from  https://github.com/nvm-sh/nvm#installing-and-updating
nvm install
yarn install

# See root package.json for docker scripts to easily run the needed containers
```

## Credit
- [Building Event-Driven Microservices](https://learning.oreilly.com/library/view/building-event-driven-microservices/9781492057888/)
- [Confluent](https://www.confluent.io/)

## Careers
Explore new opportunities with [Rise8](https://rise8.us/careers/).
