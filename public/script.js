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
let audioCtx = null

function ensureAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return null

    if (!audioCtx) {
        audioCtx = new AudioContextClass()
    }

    if (audioCtx.state === 'suspended') {
        audioCtx.resume()
    }

    return audioCtx
}

function playTone({ frequency = 440, duration = 0.12, type = 'sine', volume = 0.08, slide = 0, delay = 0 }) {
    const ctx = ensureAudioContext()
    if (!ctx) return

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + delay)
    if (slide !== 0) {
        oscillator.frequency.linearRampToValueAtTime(frequency + slide, ctx.currentTime + delay + duration)
    }

    gainNode.gain.setValueAtTime(0.0001, ctx.currentTime + delay)
    gainNode.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + delay + 0.02)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration)

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.start(ctx.currentTime + delay)
    oscillator.stop(ctx.currentTime + delay + duration)
}

function playCountdownSound() {
    playTone({ frequency: 660, duration: 0.12, type: 'triangle', volume: 0.09, slide: 60 })
}

function playHitSound() {
    playTone({ frequency: 190, duration: 0.08, type: 'square', volume: 0.12, slide: 70 })
    setTimeout(() => {
        playTone({ frequency: 260, duration: 0.08, type: 'triangle', volume: 0.09, slide: 40 })
    }, 40)
}

function playStartSound() {
    playTone({ frequency: 440, duration: 0.12, type: 'sine', volume: 0.1, slide: 40 })
    setTimeout(() => {
        playTone({ frequency: 620, duration: 0.16, type: 'triangle', volume: 0.1, slide: 70 })
    }, 90)
}

function playGameOverSound() {
    playTone({ frequency: 240, duration: 0.18, type: 'sawtooth', volume: 0.1, slide: -80 })
    setTimeout(() => {
        playTone({ frequency: 170, duration: 0.22, type: 'square', volume: 0.1, slide: -50 })
    }, 120)
}
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
    playStartSound()
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
        playCountdownSound()
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
    playGameOverSound()
    console.log("Game over")
}

board.addEventListener('click', (event) => {
    const hole = event.target.closest('.hole');
    if (!hole || hole.innerHTML == '' || time <= 0) return;

    console.log('Hit!')
    score++
    scoreSpan.textContent = score
    hole.textContent = '💥'
    playHitSound()
    setTimeout(() => {
        drawRandomMole()
    }, 200)
    moleIntervalId = restartTimer(moleIntervalId, drawRandomMole, moleDelay)
})

playBtn.addEventListener('click', () => {
    ensureAudioContext()
    startScreen.style.display = 'none'
    gameScreen.style.display = 'grid'
    startCountdown()
})

playAgainBtn.addEventListener('click', () => {
    ensureAudioContext()
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