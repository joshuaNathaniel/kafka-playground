'use strict'
const kafka = require('../../services/kafka')
const prisma = require('../../services/prisma')

const producer = kafka.producer()

module.exports = async function (fastify, opts) {
  await producer.connect()

  fastify.post('/', async function (request, reply) {
    const order = await prisma.order.create({
      data: request.body
    });

    const responses = await producer.send({
      topic: process.env.TOPIC,
      messages: [{
        key: `${process.env.TOPIC}_CREATED_${order.id}`,
        value: JSON.stringify(order)
      }]
    })

    return responses.map(response => ({
      eventId: response.baseOffset,
      ...order
    }))[0]
  })
}
