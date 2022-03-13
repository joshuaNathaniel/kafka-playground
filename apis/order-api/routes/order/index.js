'use strict';
const {produceOrderCreated} = require('../../services/kafka');
const {createNewOrder} = require('../../services/prisma');
const {findOrderById} = require('../../services/prisma.js');

module.exports = async function (fastify, opts) {
  fastify.get('/:id', async (request, reply) => ({
    order: await findOrderById(request.params.id)
  }));

  fastify.post('/', {
     handler: async function (request, reply) {
       console.log('body', request.body);
       let order = await createNewOrder(request.body);
       await produceOrderCreated(order);

       return {
         order
       }
     },
    schema: {
      body: {
        '$ref': 'order#'
      }
    }
  });

  fastify.addSchema({
    $id: 'order',
    type: 'object',
    required: [
      'productId',
      'quantity',
      'customerName',
      'customerAddress'
    ],
    properties: {
      productId: {
        type: 'number'
      },
      quantity: {
        type: 'number',
        minimum: 1
      },
      customerName: {
        type: 'string'
      },
      customerAddress: {
        type: 'string'
      }
    }
  });

};
