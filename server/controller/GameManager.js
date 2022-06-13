const Estado = require('../enum/EstadoEnum.js');
const Cargo = require('../enum/CargoEnum.js');
const Partida = require('../model/Partida.js');
const Sala = require('../model/Sala.js');
const Jogador = require('../model/Jogador.js');
const Util = require('./Util.js');
const SaguaoController = require('./SaguaoController.js');
const SalaController = require('./SalaController.js');

module.exports = {
	jogadores: {},
	salas: {},
	partidas: {},
	Util: Util,
	SaguaoController: SaguaoController,
	SalaController: SalaController,

	novaConexao: (GM, ws, req) => {
	    let jogador = new Jogador(ws);

	    ws.on('message', dados => GM.novaMensagem(GM, jogador, dados));
	    ws.on('error', erro => GM.erro(GM, jogador, erro));
	    ws.on('close', (id, descricao) => GM.conexaoFechada(GM, jogador, id, descricao));

	    ws.send(JSON.stringify({
	        tipo: 'conexao',
	        jogador: jogador.get()
	    }));
	    
	    GM.jogadores[jogador.id] = jogador;
	},
	 
	novaMensagem: (GM, jogador, json) => {
	    const dados = JSON.parse(json);
	    const ws = jogador.ws;

	    switch (dados.tipo) {
	        case 'entrar':
	            SaguaoController.entrarNoJogo(GM, ws, dados, jogador);
	            break;
	        case 'saguao':
	            SaguaoController.main(GM, ws, dados, jogador);
	            break;
	        case 'sala':
	            SalaController.main(GM, ws, dados, jogador);
	            break;
	        default:
	            break;
	    }
	},

	erro: (GM, jogador, erro) => {
	    console.error(`[${jogador.nome}] Erro na conexão: ${erro.message}`);

	    switch (jogador.estado) {
	        case Estado.SALA:
	        let sala = GM.salas[jogador.idsala];
	        	sala.delUsuario(jogador, Estado.DESCONECTADO);
	            SalaController.listar(GM, sala);
	            break;
	        default:
	            break;
	    }

	    delete GM.jogadores[jogador.id];
	},

	conexaoFechada: (GM, jogador, id, descricao) => {
	    let estado;

	    if (id == 1001) {
	        estado = Estado.DESISTENTE;
	        console.log(`[${jogador.nome}] Conexão fechada: ${id} - ${descricao}`);
	    }
	    else {
	        estado = Estado.DESCONECTADO;
	        console.log(`[${jogador.nome}] Conexão caiu: ${id} - ${descricao}`);
	    }

	    switch (jogador.estado) {
	        case Estado.SALA:
	        let sala = GM.salas[jogador.idsala];
	        	sala.delUsuario(jogador, estado);
	            SalaController.listar(GM, sala);
	            break;
	        default:
	            break;
	    }

	    delete GM.jogadores[jogador.id];
	}
}