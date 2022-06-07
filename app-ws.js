const Partida = require('./model/partida.js');
const Jogador = require('./model/jogador.js');
const WebSocket = require('ws');
const uuid = require('uuid');

let saguao = {};
let partidas = {};
let esperando = null;

function onConnection(ws, req) {
    if (!esperando) {
        let id_jogador1 = uuid.v4();
        esperando = new Jogador(ws, null, id_jogador1);

        ws.send(JSON.stringify({
            type: 'connection',
            data: 'espere'
        }));
    }
    else {
        let id_partida = uuid.v4();
        let id_jogador2 = uuid.v4();
        let jogador2 = new Jogador(ws, id_partida, id_jogador2);
        let partida = new Partida(id_partida, esperando, jogador2);
        partida.jogador1.id_partida = id_partida;

        esperando.ws.send(JSON.stringify({
            type: 'start',
            jogador: esperando.get()
        }));

        jogador2.ws.send(JSON.stringify({
            type: 'start',
            jogador: jogador2.get()
        }));

        partidas[id_partida] = partida;

        esperando = null;
    }


    ws.on('message', data => onMessage(ws, data));
    ws.on('error', error => onError(ws, error));
    ws.on('close', (reasonCode, description) => onClose(ws, reasonCode, description));

    console.log(`Jogador conectou!`);
}
 
function onMessage(ws, data) {
    console.log(`onMessage: ${data}`);
    const json = JSON.parse(data);
    ws.send(JSON.stringify({
        type: 'confirmation',
        data: 'Recebido'
    }));

    if (partidas[data.partida_id] !== null) {
        // confiar no cidadão.
        //
    }

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

function onError(ws, err) {
    console.error(`onError: ${err.message}`);
}

function onClose(ws, reasonCode, description) {
    console.log(`onClose: ${reasonCode} - ${description}`);
    const index = partidas.indexOf(ws);
    if (index > -1) {
        partidas.splice(index, 1);
    }

    if (reasonCode == 1001) {
        console.log("Jogador saiu!");
    }

    esperando = null;
}
 
module.exports = (server) => {
    const wss = new WebSocket.Server({
        server
    });
 
    wss.on('connection', onConnection);
 
    console.log(`Servidor WebSocket online!`);
    return wss;
}