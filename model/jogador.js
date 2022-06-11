const uuid = require('uuid');
const Estado = require('./model/estado.js');

class Jogador {
	id;
	idpartida;
	nome;
	tabuleiro;
	tiros;
	estado;
	oponente;
	ws;

	constructor(ws) {
		this.ws = ws;
		this.id = uuid.v4();
		this.estado = Estado.INICIAL;
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
			id: this.id,
			idpartida: this.idpartida,
			nome: this.nome,
			tabuleiro: this.tabuleiro,
			tiros: this.tiros,
			estado: this.estado
		};
	}
}

module.exports = Jogador;