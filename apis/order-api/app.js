'use strict';

const path = require('path');
const AutoLoad = require('fastify-autoload');
const {createTopic, registerOrderSchema} = require('./services/kafka');

module.exports = async function (fastify, opts) {
  await createTopic();
  await registerOrderSchema();

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  });
};
