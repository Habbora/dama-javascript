
const tabuleiroWidth = 3
const tabuleiroHeight = 3
const tabuleiroArray = []
let playerSelector = 0
const playerPiece = ['O', 'X']
let isGameOver = false

function start() {
    playerSelector = 0
    isGameOver = false
    createTabuleiroDataStructure()
    headerChanger(`Vez do jogador: ${playerPiece[playerSelector]}`)
    tabuleiroRender()
}

function createTabuleiroDataStructure() {
    const numberOfPixels = tabuleiroWidth * tabuleiroHeight

    for (let index = 0; index < numberOfPixels; index++) {
        tabuleiroArray[index] = "";
    }
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
    if (isGameOver) return

    if (tabuleiroArray[index] == ""){
        tabuleiroArray[index] = playerPiece[playerSelector]
        if (playerSelector == 0) playerSelector = 1
        else playerSelector = 0
    } else {
        console.log("Casa já está ocupada e não pode ser selecionada.")
    }

    headerChanger(`Vez do jogador: ${playerPiece[playerSelector]}`)
    tabuleiroIsGamerOver()
    tabuleiroRender()
}

function headerChanger(string) {
    document.querySelector('#header').innerHTML = string
}

function tabuleiroIsGamerOver() {
    let counter = 0
    let PlayerWin = ""
    let msg = ``

    for (let index = 0; index < tabuleiroArray.length; index++) {
        if (tabuleiroArray[index] == "") counter++;
    }

    if (counter == 0) {isGameOver = true}

    console.log("Teste")

    // Verifica o vencedor em linha
    for (let column = 0; column < tabuleiroHeight; column++) {
        const pixelIndex = column * tabuleiroHeight
        if (tabuleiroArray[pixelIndex] != "") {
            const aux1 = (tabuleiroArray[pixelIndex] == tabuleiroArray[pixelIndex + 1])
            const aux2 = (tabuleiroArray[pixelIndex] == tabuleiroArray[pixelIndex + 2])
            const aux3 = aux1 && aux2
            if (aux3) {
                isGameOver = true
                PlayerWin = tabuleiroArray[pixelIndex]
            }
        }
    }

    // Verifica o vencedor em coluna
    for (let row = 0; row < tabuleiroWidth; row++) {
        const pixelIndex = row
        if (tabuleiroArray[pixelIndex] != "") {
            const aux1 = (tabuleiroArray[pixelIndex] == tabuleiroArray[pixelIndex + tabuleiroHeight * 1])
            const aux2 = (tabuleiroArray[pixelIndex] == tabuleiroArray[pixelIndex + tabuleiroHeight * 2])
            const aux3 = aux1 && aux2
            if (aux3) {
                isGameOver = true
                PlayerWin = tabuleiroArray[pixelIndex]
            }
        }
    }

    // Verifica o vencedor a diagonal 1
    if (tabuleiroArray[0] != "") {
        const aux1 = (tabuleiroArray[0] == tabuleiroArray[1 + tabuleiroHeight * 1])
        const aux2 = (tabuleiroArray[0] == tabuleiroArray[2 + tabuleiroHeight * 2])
        const aux3 = aux1 && aux2
        if (aux3) {
            isGameOver = true
            PlayerWin = tabuleiroArray[0]
        }
    }

    // Verifica o vencedor a diagonal 2
    if (tabuleiroArray[2] != "") {
        const aux1 = (tabuleiroArray[2] == tabuleiroArray[1 + tabuleiroHeight * 1])
        const aux2 = (tabuleiroArray[2] == tabuleiroArray[0 + tabuleiroHeight * 2])
        const aux3 = aux1 && aux2
        if (aux3) {
            isGameOver = true
            PlayerWin = tabuleiroArray[2]
        }
    }

    if (isGameOver) {
        if (PlayerWin != "") {
            msg += `O player ${PlayerWin} ganhou!`
        } else {
            msg += `O jogo acabou em empate!`
        }
        console.log(msg)
        headerChanger(msg)
    } 
}

start()