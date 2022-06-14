const Estado = require('../enum/EstadoEnum.js');
const Cargo = require('../enum/CargoEnum.js');
const Partida = require('../model/Partida.js');
const Sala = require('../model/Sala.js');
const Jogador = require('../model/Jogador.js');

module.exports = {
	main: (GM, ws, dados, jogador) => {
		
	},

	jogar: (GM, ws, dados, jogador) => {
		let res = GM.Util.validarJogar(GM, jogador);

		if (res.valido) {
			let partida = new Partida(GM.salas[jogador.idsala]);

			for (let jog of partida.jogadores) {
				jog.ws.send(JSON.stringify({
					tipo: 'jogar',
					estado: 'sucesso',
					jogador: jog.get()
				}));
			}

			GM.partidas[partida.id] = partida;
		}
		else {
			ws.send(JSON.stringify({
				tipo: 'jogar',
				estado: 'erro',
				mensagem: res.mensagem
			}));
		}
	}
}