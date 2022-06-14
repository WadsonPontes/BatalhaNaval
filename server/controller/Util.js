const Estado = require('../enum/EstadoEnum.js');
const Cargo = require('../enum/CargoEnum.js');
const Partida = require('../model/Partida.js');
const Sala = require('../model/Sala.js');
const Jogador = require('../model/Jogador.js');

module.exports = {
	validarNome: (objetos, nome) => {
		let res = {
			valido: true,
			mensagem: null
		};

		if (nome.trim() == '') {
			res.valido = false;
			res.mensagem = 'Campo nome não pode está vazio';
		}
		else if (nome != nome.trim()) {
			res.valido = false;
			res.mensagem = 'Nome não pode começar ou terminar com espaço';
		}
		else if (nome.length < 3) {
			res.valido = false;
			res.mensagem = 'Nome deve ter pelo menos 3 caracteres';
		}
		else if (nome.length > 20) {
			res.valido = false;
			res.mensagem = 'Nome deve ter no máximo 20 caracteres';
		}
		else {
			for (let prop in objetos) {
				let obj = objetos[prop];

				if (obj.nome == nome) {
					res.valido = false;
					res.mensagem = 'Este nome já está sendo usado';
					break;
				}
			}
		}

		return res;
	},

	validarEntradaEmSala: (GM, nome, codigo) => {
		let sala = GM.SalaController.getByNome(GM, nome);
		let res = {
			valido: true,
			mensagem: null,
			sala: sala
		};

		if (!sala) {
			res.valido = false;
			res.mensagem = 'Sala não existe';
		}
		else if (sala.codigo != '' && sala.codigo != codigo) {
			res.valido = false;
			res.mensagem = 'Código de acesso incorreto';
		}
		else if (sala.estado == Estado.JOGO) {
			res.valido = false;
			res.mensagem = 'Partida já começou, tente outra sala';
		}

		return res;
	},

	validarSairDeSala: (GM, jogador) => {
		let sala = GM.salas[jogador.idsala];
		let res = {
			valido: true,
			mensagem: null
		};

		if (jogador.cargo == Cargo.ADMINISTRADOR) {
			res.valido = false;
			res.mensagem = 'Você não pode sair da sala que você é administrador';
		}

		return res;
	},

	validarDeletarSala: (GM, jogador) => {
		let sala = GM.salas[jogador.idsala];
		let res = {
			valido: true,
			mensagem: null
		};

		if (jogador.cargo != Cargo.ADMINISTRADOR) {
			res.valido = false;
			res.mensagem = 'Você não é administrador e não pode excluir essa sala';
		}

		return res;
	},

	validarJogar: (GM, jogador) => {
		let sala = GM.salas[jogador.idsala];
		let res = {
			valido: true,
			mensagem: null
		};

		if (jogador.cargo != Cargo.ADMINISTRADOR) {
			res.valido = false;
			res.mensagem = 'Peça para um administrador começar a partida';
		}
		else if (sala.jogadores < 2) {
			res.valido = false;
			res.mensagem = 'Número de jogadores insuficiente para começar uma partida';
		}
		else if (sala.jogadores > 2) {
			res.valido = false;
			res.mensagem = 'Número de jogadores acima do permitido';
		}

		return res;
	},

	validarPrePreparacao: (GM, jogador) => {
		let res = {
			valido: true,
			mensagem: null
		};

		res.mensagem = 'Escolha uma posição para seu porta-aviões';

		return res;
	},

	validarPreparacao: (GM, jogador, dados) => {
		let i = dados.i;
		let j = dados.j;
		let res = {
			valido: true,
			mensagem: null
		};

		switch (jogador.esquadra) {
			case 2:
				res.mensagem = 'Escolha uma posição para seu primeiro encouraçado';
				break;
			case 3:
				res.mensagem = 'Escolha uma posição para seu segundo encouraçado';
				break;
			case 4:
				res.mensagem = 'Escolha uma posição para seu primeiro hidroavião';
				break;
			case 5:
				res.mensagem = 'Escolha uma posição para seu segundo hidroavião';
				break;
			case 6:
				res.mensagem = 'Escolha uma posição para seu terceiro hidroavião';
				break;
			case 7:
				res.mensagem = 'Escolha uma posição para seu primeiro submarino';
				break;
			case 8:
				res.mensagem = 'Escolha uma posição para seu segundo submarino';
				break;
			case 9:
				res.mensagem = 'Escolha uma posição para seu terceiro submarino';
				break;
			case 10:
				res.mensagem = 'Escolha uma posição para seu quarto submarino';
				break;
			case 11:
				res.mensagem = 'Escolha uma posição para seu primeiro cruzador';
				break;
			case 12:
				res.mensagem = 'Escolha uma posição para seu segundo cruzador';
				break;
			case 13:
				res.mensagem = 'Escolha uma posição para seu terceiro cruzador';
				break;
			default:
				break;
		}

		return res;
	}
}