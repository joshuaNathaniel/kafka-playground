const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

const findShipmentByOrderId = async (orderId) =>
    await prisma.shipment.findUnique({
      where: {
        orderId: parseInt(orderId)
      }
    });

const createNewShipment = async (data) => await prisma.shipment.create({data});

module.exports = {
  prisma,
  createNewShipment,
  findShipmentByOrderId
};
