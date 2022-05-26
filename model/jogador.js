class Jogador {
	tabuleiro;
	tiros;

	constructor(ws, id_partida) {
		this.ws = ws;
		this.id_partida = id_partida;
	}
}

module.exports = Jogador;