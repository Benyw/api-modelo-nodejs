var express = require('express');
var router = express.Router();

const authMiddlewares= require('../middlewares/authentication')
const usersController = require('../controllers/usuarios');

module.exports = app => {

  app
    .route('/usuario')
    .post(
      authMiddlewares.bearer,
      usersController.criar
    )
};