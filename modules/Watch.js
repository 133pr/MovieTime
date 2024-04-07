const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const stream = async (req) => {
  const { id } = req.params;
  const item = await prisma.movie.findFirstOrThrow({
    where: { id }
  });
  return item;
};

module.exports = { stream };