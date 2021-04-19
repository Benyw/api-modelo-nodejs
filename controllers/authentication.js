const Usuario = require('../models/usuarios');
const { InvalidArgumentError, InternalServerError } = require('../errors');
const jwt = require('jsonwebtoken')
const blacklist = require('../redis/manipula-blacklist')

function criaTokenJWT(usuario) {
  const payload = {
    id: usuario.id
  }
  const token = jwt.sign(payload, process.env.CHAVE_JWT, { expiresIn: '30m' })
  return token
}

module.exports = {
  login: (req, res) => {
    const token = criaTokenJWT(req.user)
    //res.set('Authorization', token)
    const expTime = 30 * 60; // minutes * 60 = response in seconds
    res.status(200).json({status: "sucesso", token: token, expiresIn: expTime})
  },

  logout: async (req, res) => {
    try {
      const token = req.token
      await blacklist.adiciona(token)
      res.status(204).send()
    } catch (err) {
      res.status(500).json({ erro: err.message })
    }
  }
};

// PARA GERAR CHAVE_JWT
// node -e "console.log( require('crypto').randomBytes(256).toString('base64') )"