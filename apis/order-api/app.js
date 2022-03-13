'use strict';

const path = require('path');
const AutoLoad = require('fastify-autoload');
const {createTopic, registerOrderSchema, subscribeToTopic} = require('./services/kafka');

module.exports = async function (fastify, opts) {
  await createTopic();
  await registerOrderSchema();
  await subscribeToTopic();

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  });
};
