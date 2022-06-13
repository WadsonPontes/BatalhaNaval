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
	}
}