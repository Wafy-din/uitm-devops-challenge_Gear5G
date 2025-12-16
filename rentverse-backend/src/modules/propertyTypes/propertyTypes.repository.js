const { prisma } = require('../../config/database');

class PropertyTypesRepository {
  async findMany(options = {}) {
    return await prisma.propertyType.findMany(options);
  }

  async findById(id, includeCount = false) {
    const query = {
      where: { id },
    };

    if (includeCount) {
      query.include = {
        _count: {
          select: {
            properties: true,
          },
        },
      };
    }

    return await prisma.propertyType.findUnique(query);
  }

  async create(data) {
    return await prisma.propertyType.create({
      data,
    });
  }

  async update(id, data) {
    return await prisma.propertyType.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return await prisma.propertyType.delete({
      where: { id },
    });
  }

  async count(options = {}) {
    return await prisma.propertyType.count(options);
  }

  async findByCode(code) {
    return await prisma.propertyType.findUnique({
      where: { code },
    });
  }
}

module.exports = new PropertyTypesRepository();
