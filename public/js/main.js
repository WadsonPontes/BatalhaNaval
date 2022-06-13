const ws = new WebSocket("ws://" + location.host);
let e = {};
let tela = 'tela_inicial';
let modal = null;
let jogador;

ws.onmessage = (evento) => {
    const dados = JSON.parse(evento.data);

    switch (dados.tipo) {
        case 'conexao':
            jogador = dados.jogador;
            break;
        case 'entrar':
            verificarEntrarNoJogo(dados);
            break;
        case 'saguao':
            mainSaguao(dados);
            break;
        case 'sala':
            mainSala(dados);
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

function mainSala(dados) {
    switch (dados.funcao) {
        case 'criar':
            verificarCriarSala(dados);
            break;
        case 'listar':
            listarSala(dados);
            break;
        case 'entrar':
            verificarEntrarSala(dados);
            break;
        case 'sair':
            verificarSairSala(dados);
            break;
        case 'deletar':
            verificarDeletarSala(dados);
            break;
        default:
            break;
    }
}

function mainSaguao(dados) {
    switch (dados.funcao) {
        case 'listar':
            listarSaguao(dados);
            break;
        default:
            break;
    }
}

function listarSala(dados) {
    e.lista_sala.textContent = '';

    dados.jogadores.forEach((nome) => {
        const li = document.createElement('li');
        li.textContent = nome;
        e.lista_sala.appendChild(li); 
    });
}

function listarSaguao(dados) {
    e.lista_saguao.textContent = '';

    dados.salas.forEach((nome) => {
        const li = document.createElement('li');
        li.textContent = nome;
        li.onclick = () => entrarEmSala(nome);
        e.lista_saguao.appendChild(li); 
    });
}

function entrarEmSala(nome) {
    if (modal == 'modal_entrar_sala') {
        nome = e.campo_nome_entrar_sala.value;
        let codigo = e.campo_codigo_entrar_sala.value;

        ws.send(JSON.stringify({
            tipo: 'sala',
            funcao: 'entrar',
            nome: nome,
            codigo: codigo
        }));
    }
    else if (modal == 'modal_entrar_sala_oculta') {
        nome = e.campo_nome_entrar_sala_oculta.value;
        let codigo = e.campo_codigo_entrar_sala_oculta.value;

        ws.send(JSON.stringify({
            tipo: 'sala',
            funcao: 'entrar',
            nome: nome,
            codigo: codigo
        }));
    }
    else {
        e.campo_nome_entrar_sala.value = nome;

        ws.send(JSON.stringify({
            tipo: 'sala',
            funcao: 'entrar',
            nome: nome
        }));
    }
}

function sairDaSala() {
    ws.send(JSON.stringify({
        tipo: 'sala',
        funcao: 'sair'
    }));
}

function deletarSala() {
    ws.send(JSON.stringify({
        tipo: 'sala',
        funcao: 'deletar'
    }));
}

function carregarSala() {
    ws.send(JSON.stringify({
        tipo: 'sala',
        funcao: 'listar'
    }));
}

function carregarSaguao() {
    ws.send(JSON.stringify({
        tipo: 'saguao',
        funcao: 'listar'
    }));
}

function verificarEntrarNoJogo(dados) {
    if (dados.estado == 'erro') {
        e.erro_nome.textContent = dados.mensagem;
    }
    else {
        jogador = dados.jogador;
        mudarPara('tela_saguao');
    }
}

function verificarCriarSala(dados) {
    if (dados.estado == 'erro') {
        e.erro_criar_sala.textContent = dados.mensagem;
    }
    else {
        jogador = dados.jogador;
        mudarPara('tela_sala');
    }
}

function verificarEntrarSala(dados) {
    if (dados.estado == 'erro') {
        if (modal == 'modal_entrar_sala') {
            e.erro_entrar_sala.textContent = dados.mensagem;
        }
        else if (modal == 'modal_entrar_sala_oculta') {
            e.erro_entrar_sala_oculta.textContent = dados.mensagem;
        }
        else {
            abrirModal('modal_entrar_sala');
        }
    }
    else {
        jogador = dados.jogador;
        mudarPara('tela_sala');
    }
}

function verificarSairSala(dados) {
    if (dados.estado == 'erro') {
        abrirModal('modal_deletar_sala');
    }
    else {
        jogador = dados.jogador;
        mudarPara('tela_saguao');
    }
}

function verificarDeletarSala(dados) {
    if (dados.estado == 'erro') {
        e.erro_deletar_sala.textContent = dados.mensagem;
    }
    else {
        jogador = dados.jogador;
        mudarPara('tela_saguao');
    }
}

function entrarNoJogo() {
    let nome = e.campo_nome.value;

    ws.send(JSON.stringify({
        tipo: 'entrar', 
        nome: nome
    }));
}

function criarSala() {
    let nome = e.campo_nome_criar_sala.value;
    let codigo = e.campo_codigo_criar_sala.value;
    let listada = (e.campo_visibilidade_criar_sala.value === 'true');

    ws.send(JSON.stringify({
        tipo: 'sala',
        funcao: 'criar',
        nome: nome,
        codigo: codigo,
        listada: listada
    }));
}

function abrirModal(nome) {
    fecharModal();

    modal = nome;
    e[modal].showModal();
}

function fecharModal() {
    if (modal) {
        e[modal].close();
        modal = null;
    }
}

function mudarPara(nova) {
    fecharModal();

    e[nova].classList.remove('desligado');
    e[tela].classList.add('desligado');
    tela = nova;

    switch (tela) {
        case 'tela_saguao':
            carregarSaguao();
            break;
        case 'tela_sala':
            carregarSala();
            break;
        default:
            break;
    }
}

function main() {
    e.tela_inicial = document.querySelector('#tela-inicial');
    e.tela_saguao = document.querySelector('#tela-saguao');
    e.tela_sala = document.querySelector('#tela-sala');
    e.tela_preparacao = document.querySelector('#tela-preparacao');
    e.tela_jogo = document.querySelector('#tela-jogo');
    e.tela_resultado = document.querySelector('#tela-resultado');

    e.campo_nome = document.querySelector('#campo-nome');
    e.erro_nome = document.querySelector('#erro-nome');

    e.lista_saguao = document.querySelector('#lista-saguao');

    e.lista_sala = document.querySelector('#lista-sala');

    e.modal_criar_sala = document.querySelector('#modal-criar-sala');
    e.campo_nome_criar_sala = document.querySelector('#campo-nome-criar-sala');
    e.campo_codigo_criar_sala = document.querySelector('#campo-codigo-criar-sala');
    e.campo_visibilidade_criar_sala = document.querySelector('#campo-visibilidade-criar-sala');
    e.erro_criar_sala = document.querySelector('#erro-criar-sala');

    e.modal_entrar_sala = document.querySelector('#modal-entrar-sala');
    e.campo_nome_entrar_sala = document.querySelector('#campo-nome-entrar-sala');
    e.campo_codigo_entrar_sala = document.querySelector('#campo-codigo-entrar-sala');
    e.erro_entrar_sala = document.querySelector('#erro-entrar-sala');

    e.modal_entrar_sala_oculta = document.querySelector('#modal-entrar-sala-oculta');
    e.campo_nome_entrar_sala_oculta = document.querySelector('#campo-nome-entrar-sala-oculta');
    e.campo_codigo_entrar_sala_oculta = document.querySelector('#campo-codigo-entrar-sala-oculta');
    e.erro_entrar_sala_oculta = document.querySelector('#erro-entrar-sala-oculta');

    e.modal_deletar_sala = document.querySelector('#modal-deletar-sala');
    e.erro_deletar_sala = document.querySelector('#erro-deletar-sala');
}

main();