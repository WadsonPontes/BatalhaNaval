const WebSocket = require('ws');
const Partida = require('./model/partida.js');
const Jogador = require('./model/jogador.js');

let jogadores = {};
let partidas = {};

function novaConexao(ws, req) {
    let jogador = new Jogador(ws);

    ws.on('message', dados => novaMensagem(jogador, dados));
    ws.on('error', erro => erro(jogador, erro));
    ws.on('close', (id, descricao) => conexaoFechada(jogador, id, descricao));

    jogadores[jogador.id] = jogador;

    // else {
    //     let id_partida = uuid.v4();
    //     let id_jogador2 = uuid.v4();
    //     let jogador2 = new Jogador(ws, id_partida, id_jogador2, Estado.JOGANDO);
    //     let partida = new Partida(id_partida, esperando, jogador2, Estado.POSICIONAMENTO);
    //     partida.jogador1.id_partida = id_partida;

    //     esperando.ws.send(JSON.stringify({
    //         type: 'start',
    //         jogador: esperando.get()
    //     }));

    //     jogador2.ws.send(JSON.stringify({
    //         type: 'start',
    //         jogador: jogador2.get()
    //     }));

    //     partidas[id_partida] = partida;

    //     esperando = null;
    // }
}
 
function novaMensagem(jogador, dados) {
    const json = JSON.parse(dados);
    ws.send(JSON.stringify({
        type: 'confirmation',
        data: 'Recebido'
    }));

    if (partidas[json.id_partida] !== null) {
        partidas[json.id_partida].jogador1.ws.send(JSON.stringify({
            type: 'broadcast',
            username: json.username,
            message: json.message
        }));

        partidas[json.id_partida].jogador2.ws.send(JSON.stringify({
            type: 'broadcast',
            username: json.username,
            message: json.message
        }));   
    }
}

function erro(jogador, erro) {
    console.error(`[${jogador.nome}] Erro: ${erro.message}`);
}

function conexaoFechada(jogador, id, descricao) {
    console.log(`[${jogador.nome}] Conexão Fechada: ${id} - ${descricao}`);

    if (id == 1001) {
        jogadores[jogador.id].estado = Estado.DESISTENTE;
    }
    else {
        jogadores[jogador.id].estado = Estado.DESCONECTADO;
    }
}
 
module.exports = (server) => {
    const wss = new WebSocket.Server({
        server
    });
 
    wss.on('connection', novaConexao);
 
    console.log(`Servidor WebSocket online!`);
    return wss;
}