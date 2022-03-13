'use strict';

const path = require('path');
const AutoLoad = require('fastify-autoload');
const {createTopic, registerInvoiceSchema} = require('./services/kafka');
const {subscribeToTopic} = require('./services/kafka.js');

module.exports = async function (fastify, opts) {
  await createTopic();
  await registerInvoiceSchema();
  await subscribeToTopic();

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  });
};
