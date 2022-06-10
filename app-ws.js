const ESTADO = require('./model/estado.js');
const Partida = require('./model/partida.js');
const Jogador = require('./model/jogador.js');
const WebSocket = require('ws');
const uuid = require('uuid');

let partidas = {};
let esperando = null;

function onConnection(ws, req) {
    if (!esperando) {
        let id_jogador1 = uuid.v4();
        esperando = new Jogador(ws, null, id_jogador1, ESTADO.JOGANDO);

        ws.send(JSON.stringify({
            type: 'connection',
            data: 'espere'
        }));
    }
    else {
        let id_partida = uuid.v4();
        let id_jogador2 = uuid.v4();
        let jogador2 = new Jogador(ws, id_partida, id_jogador2, ESTADO.JOGANDO);
        let partida = new Partida(id_partida, esperando, jogador2, ESTADO.POSICIONAMENTO);
        partida.jogador1.id_partida = id_partida;

        esperando.ws.send(JSON.stringify({
            type: 'start',
            data: esperando.get()
        }));

        jogador2.ws.send(JSON.stringify({
            type: 'start',
            data: jogador2.get()
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

function onError(ws, err) {
    console.error(`onError: ${err.message}`);
}

function onClose(ws, reasonCode, description) {
    console.log(`onClose: ${reasonCode} - ${description}`);

    for (let key in partidas) {
        if (partidas[key].jogador1.ws == ws) {
            partidas[key].jogador1.estado = ESTADO.SAIU;
            partidas[key].ENCERRADO;

            partidas[key].jogador2.ws.send(JSON.stringify({
                type: 'encerrado',
                data: ''
            }));
        }
        else if (partidas[key].jogador2.ws == ws) {
            partidas[key].jogador2.estado = ESTADO.SAIU;
            partidas[key].ENCERRADO;

            partidas[key].jogador1.ws.send(JSON.stringify({
                type: 'encerrado',
                data: ''
            }));
        }
    }

    if (reasonCode == 1001) {
        console.log("Jogador saiu!");
    }
}
 
module.exports = (server) => {
    const wss = new WebSocket.Server({
        server
    });
 
    wss.on('connection', onConnection);
 
    console.log(`Servidor WebSocket online!`);
    return wss;
}