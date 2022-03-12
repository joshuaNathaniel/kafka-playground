'use strict';

const path = require('path');
const AutoLoad = require('fastify-autoload');
const kafka = require('./services/kafka');

const admin = kafka.admin();
const producer = kafka.producer();

module.exports = async function (fastify, opts) {
  // Place here your custom code!
  await producer.connect()
  await admin.connect()
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
        producer
      }
    }, opts)
  });
};
