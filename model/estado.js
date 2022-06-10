const Estado = Object.freeze({
    INICIAL: 1,
    SAGUAO: 2,
    PREPARACAO: 3,
    JOGO: 4,
    RESULTADO: 5,
    ATACANDO: 6,
    DEFENDENDO: 7,
    DESCONECTADO: 8,
    DESISTENTE: 9,
    DERROTADO: 10,
    VENCEDOR: 11
});

module.exports = Estado;