'use strict';
const {findInvoiceByOrderId} = require('../../services/prisma');

module.exports = async function (fastify, opts) {
  fastify.get('/:orderId', async (request, reply) => ({
    invoice: await findInvoiceByOrderId(request.params.orderId)
  }));
};
