const {Kafka} = require('kafkajs');
const {SchemaRegistry, SchemaType} = require('@kafkajs/confluent-schema-registry');
const schema = require('../kafka/schema/invoice.json');
const {createNewInvoice} = require('./prisma.js');

const {KAFKA_USERNAME: username, KAFKA_PASSWORD: password} = process.env;
const sasl = username && password ? {username, password, mechanism: 'plain'} : null;
const ssl = !!sasl;

const kafka = new Kafka({
  clientId: 'invoice-api',
  brokers: [process.env.KAFKA_BOOTSTRAP_SERVER],
  ssl,
  sasl
});

const admin = kafka.admin();
const producer = kafka.producer();
const consumer = kafka.consumer({groupId: process.env.CONSUMER_TOPIC});

const registry = new SchemaRegistry(
    {
      host: process.env.KAFKA_SCHEMA_REGISTRY_HOST
    },
    {
      [SchemaType.JSON]: {
        strict: true
      }

    });
let invoiceRegistrySchema;

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

const produceInvoiceCreated = async (invoice) => {
  await producer.connect();
  const responses = await producer.send({
    topic: process.env.PUBLISH_TOPIC,
    messages: [{
      key: `${process.env.PUBLISH_TOPIC}_CREATED_${invoice.id}`,
      value: await registry.encode(invoiceRegistrySchema.id, JSON.stringify(invoice))
    }]
  });
  await producer.disconnect();

  return responses;
};

const registerInvoiceSchema = async () =>
    invoiceRegistrySchema = await registry.register(
        {
          type: SchemaType.JSON,
          schema: JSON.stringify(schema)
        },
        {
          subject: 'record:Invoice'
        });

const subscribeToTopic = async () => {
  await consumer.connect();
  await consumer.subscribe({topic: process.env.CONSUMER_TOPIC});
  await consumer.run({
    eachMessage: async ({topic, partition, message}) => {
      const order = JSON.parse(await registry.decode(message.value));
      const invoice = await createNewInvoice({
        orderId: order.id,
        pdf: `http://some.external.location/invoice-${order.id}.pdf`
      });
      await produceInvoiceCreated(invoice);
    }
  });
};

module.exports = {
  kafka,
  registry,
  createTopic,
  produceInvoiceCreated,
  registerInvoiceSchema,
  subscribeToTopic
};
