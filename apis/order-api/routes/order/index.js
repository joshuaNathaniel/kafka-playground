'use strict';
const {produceOrderCreated} = require('../../services/kafka');
const {createNewOrder, fi} = require('../../services/prisma');
const {findOrderById} = require('../../services/prisma.js');

module.exports = async function (fastify, opts) {
  fastify.get('/:id', async (request, reply) => ({
    order: await findOrderById(request.params.id)
  }));

  fastify.post('/', async function (request, reply) {
    let order = await createNewOrder(request.body);
    await produceOrderCreated(order);

    return {
      order
    };
  });
};
