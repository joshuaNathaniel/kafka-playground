const {PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient()

const createNewOrder = async (data) => await prisma.order.create({data})

const findOrderById = async (id) => await prisma.order.findUnique({where: {id}})

module.exports = {
  prisma,
  createNewOrder,
  findOrderById
}
