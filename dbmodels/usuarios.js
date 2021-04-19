const Sequelize = require('sequelize');
const database = require('../sources/conexao');

const Usuarios = database.define('modelo_autenticacao', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    client_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    client_secret: {
      type: Sequelize.STRING,
      allowNull: false
    }
})

module.exports = Usuarios;