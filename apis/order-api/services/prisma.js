const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

const createNewOrder = async (data) => await prisma.order.create({data});

const updateOrder = async (id, data) => await prisma.order.update({where: {id: parseInt(id)}, data});

const findOrderById = async (id) => await prisma.order.findUnique({where: {id: parseInt(id)}});

module.exports = {
  prisma,
  createNewOrder,
  findOrderById,
  updateOrder
};
