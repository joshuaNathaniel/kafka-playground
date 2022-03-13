const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

const findInvoiceByOrderId = async (orderId) =>
    await prisma.invoice.findUnique({
      where: {
        orderId: parseInt(orderId),
      }
    });

const createNewInvoice = async (data) => await prisma.invoice.create({data});

module.exports = {
  prisma,
  createNewInvoice,
  findInvoiceByOrderId
};
