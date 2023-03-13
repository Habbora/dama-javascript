const tabuleiroWidth = 3
const tabuleiroHeight = 3
let currentWebSocket = null;
let tabuleiroArray = []
let connected = false

function start() {
    startSocket()
    console.log("Start")
    setInterval(() => update(currentWebSocket), 1000);
}

function reset() {
    currentWebSocket.send(JSON.stringify({emit: 'reset'}));
}

function tabuleiroRender() {
    const debug = false
    let html = `<table cellpadding=0 cellspacing=0`
    for (let column = 0; column < tabuleiroWidth; column++) {
        html += `<tr>`
        for (let row = 0; row < tabuleiroHeight; row++) {
            const pixelIndex = row + column * tabuleiroWidth
            html += `<td onclick="tabuleiroSelectCase(${pixelIndex})">`
            html += `<div class="pixel-index">${pixelIndex}</div>`
            html += tabuleiroArray[pixelIndex]
            html += `</td>`
        }
        html += `</tr>`
    }
    html += `</table>`

    document.querySelector('#display').innerHTML = html
}

function tabuleiroSelectCase(index) {
    currentWebSocket.send(JSON.stringify({emit: 'select-case', index: index}));
}

function headerChanger(string) {
    document.querySelector('#header').innerHTML = string
}

function update(socket) {
    console.log("Run")
    if (connected) {
        socket.send(JSON.stringify({emit: 'get-tabuleiro'}));
    }
}

let startSocket = function() {
    playerId = null;
    const ws = new WebSocket('ws://179.182.211.76:8080');

    ws.addEventListener("open", event => {
        console.log('open');
        currentWebSocket = ws;
        connected = true
    });

    ws.addEventListener("message", event => {
        let command = JSON.parse(event.data);
        tabuleiroArray = command.tabuleiroArray;
        headerChanger(command.msgHeader)
        tabuleiroRender();
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

start()