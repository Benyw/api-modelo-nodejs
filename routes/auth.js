var express = require('express');
var router = express.Router();

const authMiddlewares= require('../middlewares/authentication')
const authControlador = require('../controllers/authentication');

module.exports = app => {

  app
    .route('/token')
    .post(
      authMiddlewares.local,
      authControlador.login
    )
  
  app
    .route('/logout')
    .post(
      authMiddlewares.bearer,
      authControlador.logout
    )
};