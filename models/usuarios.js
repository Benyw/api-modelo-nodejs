const bcrypt = require('bcrypt');

const { InvalidArgumentError } = require('../errors');
const validacoes = require('../validations');
const usuariosDao = require('../dbmodels/usuarios');

class Usuario {

  constructor(usuario) {
    this.client_id = usuario.client_id;
    this.client_secret = usuario.client_secret;

    this.valida();
  }

  async adiciona() {
    if (await Usuario.buscaPorClientId(this.client_id)) {
      return false;
    }

    const senha = this.client_secret

    await this.adicionaSenha(this.client_secret)

    const usuarioAdicionado = await usuariosDao.create({
      client_id: this.client_id,
      client_secret: this.client_secret
    })

    return { ...usuarioAdicionado.dataValues, client_secret: senha}
  }

  async adicionaSenha(client_secret) {
    validacoes.campoStringNaoNulo(client_secret, 'client_secret');
    validacoes.campoTamanhoMinimo(client_secret, 'client_secret', 0);
    validacoes.campoTamanhoMaximo(client_secret, 'client_secret', 64);

    this.client_secret = await Usuario.gerarSenhaHash(client_secret);
  }

  valida() {
    validacoes.campoStringNaoNulo(this.client_id, 'client_id');
    validacoes.campoStringNaoNulo(this.client_secret, 'client_secret');
  }

  async deleta() {
    return usuariosDao.deleta(this);
  }

  static async buscaPorId(id) {
    return usuariosDao.findByPk(id)
    .then(function(usuario){
      if(typeof usuario.dataValues.id !== 'number') {
        return null;
      }
      var usuario_log = usuario.dataValues
      return new Usuario(usuario_log);
    }).catch(function(err){
      return err;
    })
  }

  static async buscaPorClientId(client_id) {
    return usuariosDao.findAll({
      where: {
        client_id: client_id
      }
    }).then(function(usuario){
      if(usuario.length === 0) {
        return null;
      }
      var usuario_log = usuario[0].dataValues
      return new Usuario(usuario_log);
    }).catch(function(err){
      return err;
    })
  }

  static lista() {
    return usuariosDao.lista();
  }

  static gerarSenhaHash(senha) {
    const custoHash = 12;
    return bcrypt.hash(senha, custoHash);
  }
}

module.exports = Usuario;