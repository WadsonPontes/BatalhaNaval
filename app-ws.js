const WebSocket = require('ws');
const Estado = require('./model/estado.js');
const Partida = require('./model/partida.js');
const Jogador = require('./model/jogador.js');

let jogadores = {};
let partidas = {};

function entrarNoJogo(ws, dados, jogador) {
    jogador.nome = dados.nome;
    jogador.estado = Estado.SAGUAO;

    ws.send(JSON.stringify({
        tipo: 'entrar',
        jogador: jogador.get()
    }));
}

function dadosDoSaguao() {
    let jgs = [];

    for (prop in jogadores) {
        let j = jogadores[prop];

        if (j.estado == Estado.SAGUAO) {
            jgs.push(j.nome);
        }
    }

    for (prop in jogadores) {
        let j = jogadores[prop];

        if (j.estado == Estado.SAGUAO) {
            j.ws.send(JSON.stringify({
                tipo: 'saguao',
                jogadores: jgs
            }));
        }
    }
}

function novaConexao(ws, req) {
    let jogador = new Jogador(ws);

    ws.on('message', dados => novaMensagem(jogador, dados));
    ws.on('error', erro => erro(jogador, erro));
    ws.on('close', (id, descricao) => conexaoFechada(jogador, id, descricao));

    ws.send(JSON.stringify({
        tipo: 'conexao',
        jogador: jogador.get()
    }));

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
 
function novaMensagem(jogador, json) {
    const dados = JSON.parse(json);
    const ws = jogador.ws;

    switch (dados.tipo) {
        case 'entrar':
            entrarNoJogo(ws, dados, jogador);
            break;
        case 'saguao':
            dadosDoSaguao();
            break;
        default:
            break;
    }
}

function erro(jogador, erro) {
    let estado = jogador.estado;

    jogador.estado = Estado.DESCONECTADO;
    console.error(`[${jogador.nome}] Erro na conexão: ${erro.message}`);

    switch (estado) {
        case Estado.SAGUAO:
            dadosDoSaguao();
            break;
        default:
            break;
    }
}

function conexaoFechada(jogador, id, descricao) {
    let estado = jogador.estado;

    if (id == 1001) {
        jogador.estado = Estado.DESISTENTE;
        console.log(`[${jogador.nome}] Conexão fechada: ${id} - ${descricao}`);
    }
    else {
        jogador.estado = Estado.DESCONECTADO;
        console.log(`[${jogador.nome}] Conexão caiu: ${id} - ${descricao}`);
    }

    switch (estado) {
        case Estado.SAGUAO:
            dadosDoSaguao();
            break;
        default:
            break;
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