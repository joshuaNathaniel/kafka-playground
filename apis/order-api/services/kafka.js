const {Kafka} = require('kafkajs');
const {SchemaRegistry, SchemaType} = require('@kafkajs/confluent-schema-registry');

const {KAFKA_USERNAME: username, KAFKA_PASSWORD: password} = process.env;
const sasl = username && password ? {username, password, mechanism: 'plain'} : null;
const ssl = !!sasl;

// This creates a client instance that is configured to connect to the Kafka broker provided by
// the environment variable KAFKA_BOOTSTRAP_SERVER
const kafka = new Kafka({
  clientId: 'orders-api',
  brokers: [process.env.KAFKA_BOOTSTRAP_SERVER],
  ssl,
  sasl
});

const registry = new SchemaRegistry(
    {
      host: process.env.KAFKA_SCHEMA_REGISTRY_HOST
    },
    {
      [SchemaType.JSON]: {
        strict: true
      }

    });

module.exports = {
  kafka,
  registry
};
