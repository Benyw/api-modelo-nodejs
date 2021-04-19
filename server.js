require('dotenv').config()
const app = require('./app');
const port = 3000;
const db = require('./sources/conexao');
require('./redis/blacklist')

const routes = require('./routes');
routes(app);

app.listen(port, () => console.log(`Servidor respondendo na porta ${port}`));