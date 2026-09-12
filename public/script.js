const board = document.querySelector('.board');
const scoreSpan = document.querySelector('.score span')
const finalScoreSpan = document.querySelector('.final-score')
const timeSpan = document.querySelector('.time span')
const holes = document.querySelectorAll('.hole')

const startScreen = document.querySelector('.start-screen')
const gameScreen = document.querySelector('.game-screen')
const gameOverScreen = document.querySelector('.game-over-screen')

const playBtn = document.querySelector('.play')
const playAgainBtn = document.querySelector('.play-again')

let score = 0
let preIdx = 0

let time = 30

let gameStarted = false
let gameIntervalId

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function restartTimer() {
    clearInterval(gameIntervalId)
    gameIntervalId = setInterval(changeTime, 1500)
}

function changeTime() {
    time--
    timeSpan.textContent = time

    if (time <= 0) {
        gameOver()
        return
    }
    drawRandomMole()
}

function drawRandomMole() {
    let randomIdx = getRandomInt(0, 8)
    while (randomIdx == preIdx) {
        randomIdx = getRandomInt(0, 8)
    }
    preIdx = randomIdx

    holes.forEach((hole) => {
        hole.innerText = ""
    })

    holes[randomIdx].textContent = "🐹"
}

function startGame() {
    gameStarted = true
    restartTimer()
    console.log("Game started");
}

function gameOver() {
    gameStarted = false
    clearInterval(gameIntervalId)
    gameScreen.style.display = 'none'
    gameOverScreen.style.display = 'grid'
    finalScoreSpan.textContent = score
    console.log("Game over")
}

board.addEventListener('click', (event) => {
    if (!gameStarted && time > 0) startGame()
    const hole = event.target.closest('.hole');
    if (!hole || hole.innerHTML == '' || time <= 0) return;

    console.log('Hit!')
    score++
    scoreSpan.textContent = score
    drawRandomMole()
    restartTimer()
})

playBtn.addEventListener('click', () => {
    startScreen.style.display = 'none'
    gameScreen.style.display = 'grid'
})

playAgainBtn.addEventListener('click', () => {
    score = 0
    time = 30
    scoreSpan.textContent = score
    timeSpan.textContent = time
    gameScreen.style.display = 'none'
    gameOverScreen.style.display = 'none'
    gameScreen.style.display = 'grid'
})