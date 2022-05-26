const Partida = require('./model/partida.js');
const Jogador = require('./model/jogador.js');
const WebSocket = require('ws');

let partidas = [];
let esperando = null;

function onConnection(ws, req) {
    if (!esperando) {
        esperando = new Jogador(ws, partidas.length);

        ws.send(JSON.stringify({
            type: 'connection',
            data: 'espere'
        }));
    }
    else {
        let jogador2 = new Jogador(ws, partidas.length);
        let partida = new Partida(partidas.length, esperando, jogador2);

        esperando.ws.send(JSON.stringify({
            type: 'connection',
            data: partidas.length
        }));

        jogador2.ws.send(JSON.stringify({
            type: 'connection',
            data: partidas.length
        }));

        partidas.push(partida);

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
    console.log('streaming to', partidas.length, 'partidas');

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