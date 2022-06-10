class Jogador {
	tabuleiro;
	tiros;
	nome;

	constructor(ws, id_partida, id_jogador, estado) {
		this.ws = ws;
		this.id_partida = id_partida;
		this.id_jogador = id_jogador;
		this.estado = estado;
		this.init();
	}

	init() {
		this.tabuleiro = [];
		this.tiros = [];

		for (let i = 0; i < 10; ++i) {
			this.tabuleiro[i] = [];
			this.tiros[i] = [];

			for (let j = 0; j < 10; ++j) {
				this.tabuleiro[i][j] = 0;
				this.tiros[i][j] = 0;
			}
		}
	}

	get() {
		return {
			id_partida: this.id_partida,
			id_jogador: this.id_jogador,
			tabuleiro: this.tabuleiro,
			tiros: this.tiros
		};
	}
}

module.exports = Jogador;