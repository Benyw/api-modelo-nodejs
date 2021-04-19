const { InvalidArgumentError } = require('./errors');

module.exports = {
  campoStringNaoNulo: (valor, nome) => {
    if (typeof valor !== 'string' || valor === 0)
      throw new InvalidArgumentError(`É necessário preencher o campo ${nome}!`);
    return false;
  },

  campoTamanhoMinimo: (valor, nome, minimo) => {
    if (valor.length < minimo)
      return new InvalidArgumentError(`O campo ${nome} precisa ser maior que ${minimo} caracteres!`);
    return false;
  },

  campoTamanhoMaximo: (valor, nome, maximo) => {
    if (valor.length > maximo)
      throw new InvalidArgumentError(`O campo ${nome} precisa ser menor que ${maximo} caracteres!`);
    return false;
  }
};