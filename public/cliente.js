const ws = new WebSocket("ws://" + location.host);
let e = {}; // Elementos
// let jogador;

// ws.onmessage = (event) => {
//     const dados = JSON.parse(event.data);

//     if (dados.type == 'connection') {
//         msg_espera.innerHTML = "Esperando oponente!";
//     }
//     else if (dados.type == 'start') {
//         msg_espera.innerHTML = "";
//         jogador = dados.jogador;
//     }
//     else if (dados.type == 'broadcast') {
//         // cria a mensagem na tela.
//         const divMensagemLinha = document.createElement("DIV");
//         const divMensagemNomePessoa = document.createElement("DIV");
//         const divMensagemConteudo = document.createElement("DIV");
        
//         divMensagemNomePessoa.className = "nome-pessoa";
        
//         if (dados.username == username.value) {
//             divMensagemLinha.className = "mensagem-usuario";
//             divMensagemNomePessoa.innerHTML = "Você: ";
//         } else {
//             divMensagemLinha.className = "mensagem-outro";
//             divMensagemNomePessoa.innerHTML = `${dados.username}: `;
//         } 

//         divMensagemConteudo.innerHTML = dados.message;

//         divMensagemLinha.appendChild(divMensagemNomePessoa);
//         divMensagemLinha.appendChild(divMensagemConteudo);
        
//         chat.appendChild(divMensagemLinha);        
//     }
//     else if (json.type == 'encerrado') {
//         msg_espera.innerHTML = "Partida Encerrada, adversário saiu!";
//     }
// }

// function send() {
//     if (username.value == "") {
//         alert("Por favor, digite um nome de usuário!");
//         username.focus();
//         return;
//     }

//     if (msg.value == "") {
//         alert("Por favor, digite uma mensagem!");
//         msg.focus();
//         return;
//     }

//     ws.send(JSON.stringify({
//         type: 'message', 
//         username: username.value,
//         message: msg.value,
//         id_partida: id_partida
//     }));

//     msg.value = '';
//     msg.focus();
// }

// function pressionouTecla(event) {
//     if (event.keyCode == 13) {
//         send();
//     }
// }

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

function main() {
    e.tela_inicial = document.querySelector('#tela-inicial');
    e.tela_saguao = document.querySelector('#tela-saguao');
    e.tela_preparacao = document.querySelector('#tela-preparacao');
    e.tela_jogo = document.querySelector('#tela-jogo');
    e.tela_resultado = document.querySelector('#tela-resultado');

    e.campo_nome = document.querySelector('#campo-nome');
}

main();