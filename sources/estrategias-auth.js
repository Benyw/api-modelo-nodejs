const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

const Usuario = require('../models/usuarios');

const { InvalidArgumentError } = require('../errors');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const blacklist = require('../redis/manipula-blacklist');

function verificaUsuario(usuario) {
  if (!usuario) {
    throw new InvalidArgumentError('Não existe usuário com esse client_id!');
  }
}

async function verificaTokenNaBlacklist(token) {
  const tokenNaBlacklist = await blacklist.contemToken(token);
  if (tokenNaBlacklist) {
    throw new jwt.JsonWebTokenError('Token inválido por logout!');
  }
}

async function verificaSenha(senha, senhaHash) {
  const senhaValida = await bcrypt.compare(senha, senhaHash);
  //const senhaValida = senha === senhaHash;
  if (!senhaValida) {
    throw new InvalidArgumentError('Client_id e/ou client_secret inválidos!');
  }
}

passport.use(
  new LocalStrategy(
    {
      usernameField: 'client_id',
      passwordField: 'client_secret',
      session: false
    },
    async (client_id, client_secret, done) => {
      try {
        const usuario = await Usuario.buscaPorClientId(client_id);
        verificaUsuario(usuario);
        await verificaSenha(client_secret, usuario.client_secret);
        done(null, usuario);
      } catch (erro) {
        done(erro);
      }
    }
  )
);

passport.use(
  new BearerStrategy(
    async (token, done) => {
      try {
        await verificaTokenNaBlacklist(token);
        const payload = jwt.verify(token, process.env.CHAVE_JWT);
        const usuario = await Usuario.buscaPorId(payload.id);
        done(null, usuario, { token: token });
      } catch (erro) {
        done(erro);
      }      
    }
  )
)