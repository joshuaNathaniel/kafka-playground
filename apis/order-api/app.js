'use strict';

const path = require('path');
const AutoLoad = require('fastify-autoload');
const {kafka, registry} = require('./services/kafka');
const {SchemaType} = require('@kafkajs/confluent-schema-registry');
const schema = require('./kafka/schema/order.json');

const admin = kafka.admin();

module.exports = async function (fastify, opts) {
  const {id} = await registry.register(
      {
        type: SchemaType.JSON,
        schema: JSON.stringify(schema)
      },
      {
        subject: 'record:Order'
      });

  await admin.connect();
  await admin.createTopics({
    topics: [
      {
        topic: process.env.TOPIC
      }
    ],
    waitForLeaders: true
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({
      kafka: {
        schema: {
          orderId: id
        }
      }
    }, opts)
  });
};
