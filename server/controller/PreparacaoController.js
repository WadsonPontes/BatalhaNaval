const Estado = require('../enum/EstadoEnum.js');
const Cargo = require('../enum/CargoEnum.js');
const Partida = require('../model/Partida.js');
const Sala = require('../model/Sala.js');
const Jogador = require('../model/Jogador.js');

module.exports = {
	main: (GM, ws, dados, jogador) => {
		switch (dados.funcao) {
			case 'listar':
				GM.PreparacaoController.listar(GM, ws, dados, jogador);
				break;
			case 'posicionar':
				GM.PreparacaoController.posicionar(GM, ws, dados, jogador);
				break;
			default:
				break;
		}
	},

	listar: (GM, ws, dados, jogador) => {
		let res = GM.Util.validarPrePreparacao(GM, jogador);

		if (res.valido) {
			ws.send(JSON.stringify({
				tipo: 'preparacao',
				funcao: 'listar',
				estado: 'sucesso',
				mensagem: res.mensagem,
				jogador: jogador.get()
			}));
		}
		else {
			ws.send(JSON.stringify({
				tipo: 'preparacao',
				funcao: 'listar',
				estado: 'erro',
				mensagem: res.mensagem
			}));
		}
	},

	posicionar: (GM, ws, dados, jogador) => {
		let res = GM.Util.validarPreparacao(GM, jogador, dados);

		if (res.valido) {
			jogador.addEsquedra(dados);

			ws.send(JSON.stringify({
				tipo: 'preparacao',
				funcao: 'listar',
				estado: 'sucesso',
				mensagem: res.mensagem,
				jogador: jogador.get()
			}));
		}
		else {
			ws.send(JSON.stringify({
				tipo: 'preparacao',
				funcao: 'listar',
				estado: 'erro',
				mensagem: res.mensagem
			}));
		}
	}
}