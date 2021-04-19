const auth = require('./auth');
const usuarios = require('./usuarios');

module.exports = app => {
  app.get('/', (req, res) => {res.send('API de bancarização por Fidúcia SCMEPP. Para saber mais, acesse https://fiduciascm.com.br')});

  auth(app);
  usuarios(app);
};