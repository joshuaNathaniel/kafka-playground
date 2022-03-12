'use strict'
const uuid = require('uuid')

module.exports = async function (fastify, opts) {
  fastify.post('/', async function (request, reply) {
    const orderUuid = uuid.v4();
    const {kafka: {producer}} = opts

    const responses = await producer.send({
      topic: process.env.TOPIC,
      messages: [{
        key: `${process.env.TOPIC}-${orderUuid}`,
        value: JSON.stringify(request.body)
      }]
    })

    return responses.map(resp => ({
      id: resp.baseOffset,
      orderUuid
    }))[0]
  })
}
