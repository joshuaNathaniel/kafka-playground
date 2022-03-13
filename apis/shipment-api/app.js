'use strict';

const path = require('path');
const AutoLoad = require('fastify-autoload');
const {createTopic, registerShipmentSchema, subscribeToTopic} = require('./services/kafka');

module.exports = async function (fastify, opts) {
  await createTopic();
  await registerShipmentSchema();
  await subscribeToTopic();

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  });
};
