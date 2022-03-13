const {Kafka} = require('kafkajs');
const {SchemaRegistry, SchemaType} = require('@kafkajs/confluent-schema-registry');
const schema = require('../kafka/schema/order.json');

const {KAFKA_USERNAME: username, KAFKA_PASSWORD: password} = process.env;
const sasl = username && password ? {username, password, mechanism: 'plain'} : null;
const ssl = !!sasl;

const kafka = new Kafka({
  clientId: 'order-api',
  brokers: [process.env.KAFKA_BOOTSTRAP_SERVER],
  ssl,
  sasl
});

const admin = kafka.admin();
const producer = kafka.producer();

const registry = new SchemaRegistry(
    {
      host: process.env.KAFKA_SCHEMA_REGISTRY_HOST
    },
    {
      [SchemaType.JSON]: {
        strict: true
      }

    });
let orderRegistrySchema;

const createTopic = async () => {
  await admin.connect();
  await admin.createTopics({
    topics: [
      {
        topic: process.env.PUBLISH_TOPIC,
        numPartitions: 1,
        replicationFactor: 1
      }
    ],
    waitForLeaders: true
  });
  await admin.disconnect();
};

const produceOrderCreated = async (order) => {
  await producer.connect();
  const responses = await producer.send({
    topic: process.env.PUBLISH_TOPIC,
    messages: [{
      key: `${process.env.PUBLISH_TOPIC}_CREATED_${order.id}`,
      value: await registry.encode(orderRegistrySchema.id, JSON.stringify(order))
    }]
  });
  await producer.disconnect();

  return responses;
};

const registerOrderSchema = async () =>
    orderRegistrySchema = await registry.register(
        {
          type: SchemaType.JSON,
          schema: JSON.stringify(schema)
        },
        {
          subject: 'record:Order'
        });

module.exports = {
  kafka,
  registry,
  createTopic,
  produceOrderCreated,
  registerOrderSchema
};
