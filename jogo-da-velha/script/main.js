var gameId = null
let currentWebSocket = null
let connected = false
let newGame = false

function tabuleiroRender(array, width, height) {
    let html = `<table cellpadding=0 cellspacing=0`

    for (let column = 0; column < width; column++) {
        html += `<tr>`
        for (let row = 0; row < height; row++) {
            const index = row + column * width
            html += `<td onclick="tabuleiroSelectCase(${index})">`
            html += `<div class="case-index">${index}</div>`
            html += array[index]
            html += `</td>`
        }
        html += `</tr>`
    }
    html += `</table>`

    console.log("cmd: render;")
    document.querySelector('#display').innerHTML = html
}

function start() {
    startSocket()
    console.log("cmd: start;")
    setInterval(() => update(currentWebSocket), 1000);
}

function reset() {
    console.log("cmd: reset;")
    currentWebSocket.send(JSON.stringify({gameId: gameId, emit: 'reset'}));
}

function tabuleiroSelectCase(index) {
    console.log(`cmd: select-case(${index})`)
    currentWebSocket.send(JSON.stringify({gameId: gameId, emit: 'select-case', index: index}));
}

function headerChanger(string) {
    console.log(`cmd: header(${string})`)
    document.querySelector('#header').innerHTML = string
}

function update(socket) {
    if (connected) {
        socket.send(JSON.stringify({gameId: gameId, emit: 'get-tabuleiro'}));
    }
}

function criarTabuleiro() {
    if (connected) {
        currentWebSocket.send(JSON.stringify({
            gameId: 0, emit: 'create-game'
        }));
        newGame = true
    }
}

function conectarTabuleiro() {
    let gameId = document.getElementById("gameId").value;
    
    if (connected) {
        currentWebSocket.send(JSON.stringify({
            gameId: gameId, emit: 'connect-game'
        }));
        newGame = true
    }
}

const ws = new WebSocket("wss://habbora.com.br:4000");

let startSocket = function() {
    ws.addEventListener("open", event => {
        console.log('Conectado');
        currentWebSocket = ws;
        connected = true
    });

    ws.addEventListener("message", event => {
        let command = JSON.parse(event.data);
        gameId = command.gameId
        tabuleiroRender(command.tabuleiroArray, command.tabuleiroWidth, command.tabuleiroHeight)
        headerChanger(command.msgHeader)
        if (newGame) document.getElementById("gameId").value = gameId;
        newGame = false
    });

    ws.addEventListener("close", event => {
        console.log("WebSocket closed, reconnecting:", event.code, event.reason);
        connected = false
        startSocket();
    });
    ws.addEventListener("error", event => {
        console.log("WebSocket error, reconnecting:", event);
        connected = false
        startSocket();
    });
}

start();