const Usuario = require('../models/usuarios');
const { InvalidArgumentError, InternalServerError } = require('../errors');

module.exports = {
  criar: async (req, res) => {
    const obj = new Usuario(req.body)
    const criado = await obj.adiciona()

    console.log(criado)

    if(!criado)
        res.status(403).json({status: "erro", message: "Erro ao criar usuário!"})

    res.status(201).json(criado)
  }
};