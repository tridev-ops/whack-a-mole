const board = document.querySelector('.board');
const scoreSpan = document.querySelector('.score span')
const finalScoreSpan = document.querySelector('.final-score')
const timeSpan = document.querySelector('.time span')
const countdown = document.querySelector('.countdown')
const holes = document.querySelectorAll('.hole')

const startScreen = document.querySelector('.start-screen')
const gameScreen = document.querySelector('.game-screen')
const gameOverScreen = document.querySelector('.game-over-screen')

const playBtn = document.querySelector('.play')
const playAgainBtn = document.querySelector('.play-again')

let score = 0
let preIdx = 0

let time = 30
let moleDelay = 2000

let gameStarted = false
let moleIntervalId
let timeIntervalId
let countdownIntervalId

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function restartTimer(intervalId, func, delay) {
    clearInterval(intervalId)
    return setInterval(func, delay)
}

function changeTime() {
    time--
    timeSpan.textContent = time

    if (time <= 0) {
        gameOver()
        return
    }

    if (time === 20) {
        moleDelay = 1500
        moleIntervalId = restartTimer(moleIntervalId, drawRandomMole, moleDelay)
    }

    if (time === 10) {
        moleDelay = 1000
        moleIntervalId = restartTimer(moleIntervalId, drawRandomMole, moleDelay)
    }
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
    drawRandomMole()
    timeIntervalId = restartTimer(timeIntervalId, changeTime, 1000)
    moleIntervalId = restartTimer(moleIntervalId, drawRandomMole, moleDelay)
    console.log("Game started");
}

function startCountdown() {
    clearInterval(countdownIntervalId)
    gameStarted = false
    holes.forEach((hole) => {
        hole.textContent = ''
    })
    countdown.textContent = '3'
    let count = 3

    countdownIntervalId = setInterval(() => {
        count--

        if (count === 0) {
            clearInterval(countdownIntervalId)
            countdown.textContent = ''
            startGame()
            return
        }

        countdown.textContent = count
    }, 1000)
}

function gameOver() {
    gameStarted = false
    clearInterval(countdownIntervalId)
    clearInterval(timeIntervalId)
    clearInterval(moleIntervalId)
    gameScreen.style.display = 'none'
    gameOverScreen.style.display = 'grid'
    finalScoreSpan.textContent = score
    console.log("Game over")
}

board.addEventListener('click', (event) => {
    const hole = event.target.closest('.hole');
    if (!hole || hole.innerHTML == '' || time <= 0) return;

    console.log('Hit!')
    score++
    scoreSpan.textContent = score
    drawRandomMole()
    moleIntervalId = restartTimer(moleIntervalId, drawRandomMole, moleDelay)
})

playBtn.addEventListener('click', () => {
    startScreen.style.display = 'none'
    gameScreen.style.display = 'grid'
    startCountdown()
})

playAgainBtn.addEventListener('click', () => {
    score = 0
    time = 30
    moleDelay = 2000
    scoreSpan.textContent = score
    timeSpan.textContent = time
    gameScreen.style.display = 'none'
    gameOverScreen.style.display = 'none'
    gameScreen.style.display = 'grid'
    startCountdown()
})