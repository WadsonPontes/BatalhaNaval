const uuid = require('uuid');
const Estado = require('../enum/EstadoEnum.js');
const Cargo = require('../enum/CargoEnum.js');

class Partida {
    id;
    idsala;
    jogadores;
    vez;
    estado;

    constructor(idsala, ...jogadores) {
        this.id = uuid.v4();
        this.idsala = idsala;
        this.jogadores = jogadores;
        this.vez = 1;
        this.estado = Estado.PREPARACAO;
    }
}

module.exports = Partida;