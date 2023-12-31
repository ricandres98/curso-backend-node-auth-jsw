const boom = require('@hapi/boom');

const sequelize = require('./../libs/sequelize');

class OrderService {

  constructor(){
  }
  async create(userId) {
    const customer = await sequelize.models.Customer.findOne({
      where: {
        userId: userId
      }
    });
    const data = {
      customerId: customer.id,
    }
    const newOrder = await sequelize.models.Order.create(data);
    return newOrder;
  }

  async addItem(data) {
    const newItem = await sequelize.models.OrderProduct.create(data);
    return newItem;
  }

  async find() {
    const orders = await sequelize.models.Order.findAll();
    return orders;
  }

  async findOne(id) {
    const order = await sequelize.models.Order.findByPk(id, {
      include: [
        {
          association: 'customer',
          include: ["user"],
        },
        {
          association: 'items'
        }
      ]
    });
    if(!order) {
      throw boom.notFound('That order doesn`t exists');
    }
    return order;
  }

  async findByUser(userId) {
    const orders = await sequelize.models.Order.findAll({
      include: [
        {
          association: 'customer',
          include: ['user']
        }
      ],
      where: {
        '$customer.user.id$': userId
      }
    });
    for(let i = 0; i < orders.length; i++) {
      delete orders[i].dataValues.customer.user.dataValues.password;
    }

    return orders;
  }

  async update(id, changes) {
    return {
      id,
      changes,
    };
  }

  async delete(id) {
    return { id };
  }

}

module.exports = OrderService;
