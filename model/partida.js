class Partida {
  constructor(id_partida, jogador1, jogador2) {
    this.id_partida = id_partida;
    this.jogador1 = jogador1;
    this.jogador2 = jogador2;
    this.vez = 1;
  }
}

module.exports = Partida;