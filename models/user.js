const { Sequelize, Model, DataTypes } = require('sequelize');

const sequelize = new Sequelize('node_users_api_development', 'postgres', 'postgres', {
  dialect: 'postgres',
  host: 'localhost'
})

class User extends Model { }

User.init({
  name: DataTypes.STRING,
  email: DataTypes.STRING
}, { sequelize, modelName: 'user' });

module.exports = { User }