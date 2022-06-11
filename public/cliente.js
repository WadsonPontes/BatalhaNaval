const ws = new WebSocket("ws://" + location.host);
let e = {};
let tela = 'tela_inicial';
let jogador;

ws.onmessage = (evento) => {
    const dados = JSON.parse(evento.data);

    switch (dados.tipo) {
        case 'conexao':
            jogador = dados.jogador;
            break;
        case 'entrar':
            jogador = dados.jogador;
            mudarPara('tela_saguao');
            break;
        case 'saguao':
            atualizarSaguao(dados);
            break;
        default:
            break;
    }
}

ws.onerror = (erro) => {
    console.log(`Erro na conexão: ${erro}`);
}

ws.onclose = (id, descricao) => {
    console.log(`Conexão fechada: ${id} - ${descricao}`);
}

function atualizarSaguao(dados) {
    e.lista_saguao.textContent = '';

    dados.jogadores.forEach((j) => {
        const li = document.createElement('li');
        li.textContent = j;
        e.lista_saguao.appendChild(li); 
    });
}

function carregarSaguao() {
    ws.send(JSON.stringify({
        tipo: 'saguao'
    }));
}

function entrar() {
    if (e.campo_nome.value == "") {
        alert("Por favor, digite um nome de usuário!");
        e.campo_nome.focus();
        return;
    }

    ws.send(JSON.stringify({
        tipo: 'entrar', 
        nome: e.campo_nome.value
    }));
}

function mudarPara(nova) {
    e[nova].classList.remove('desligado');
    e[tela].classList.add('desligado');
    tela = nova;

    switch (tela) {
        case 'tela_saguao':
            carregarSaguao();
            break;
        default:
            break;
    }
}

function main() {
    e.tela_inicial = document.querySelector('#tela-inicial');
    e.tela_saguao = document.querySelector('#tela-saguao');
    e.tela_preparacao = document.querySelector('#tela-preparacao');
    e.tela_jogo = document.querySelector('#tela-jogo');
    e.tela_resultado = document.querySelector('#tela-resultado');

    e.campo_nome = document.querySelector('#campo-nome');
    e.lista_saguao = document.querySelector('#lista-saguao');
}

main();