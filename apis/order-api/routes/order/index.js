'use strict';
const {kafka, registry} = require('../../services/kafka');
const prisma = require('../../services/prisma');

const producer = kafka.producer();

module.exports = async function (fastify, opts) {
  await producer.connect();

  fastify.post('/', async function (request, reply) {
    let order = await prisma.order.create({
      data: request.body
    });

    let {id, ...orderStuff} = order;
    console.log('id', opts.kafka.schema.orderId);

    const responses = await producer.send({
      topic: process.env.TOPIC,
      messages: [{
        key: `${process.env.TOPIC}_CREATED_${order.id}`,
        value: await registry.encode(opts.kafka.schema.orderId, JSON.stringify(orderStuff))
      }]
    });

    return responses.map(response => ({
      eventId: response.baseOffset,
      ...orderStuff
    }))[0];
  });
};
