const board = document.querySelector('.board');
const scoreSpan = document.querySelector('.score span')
const timeSpan = document.querySelector('.time span')
const holes = document.querySelectorAll('.hole')

let score = 0
let preIdx = 0

let time = 30

let gameStarted = false
let gameIntervalId 

board.addEventListener('click', (event) => {
    if (!gameStarted && time > 0) startGame()
    const hole = event.target.closest('.hole');
    if (!hole || hole.innerHTML == '' || time <= 0) return;

    score++
    scoreSpan.textContent = score
    drawRandomMole()
})

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawRandomMole(){
    let randomIdx = getRandomInt(0, 8)
    while (randomIdx == preIdx){
        randomIdx = getRandomInt(0, 8)
    }
    preIdx = randomIdx

    holes.forEach((hole)=>{
        hole.innerText = ""
    })

    holes[randomIdx].textContent = "🐹"
}

function startGame(){
    gameStarted = true
    gameIntervalId = setInterval(changeTime, 1000)
    console.log("Game started");
}

function gameOver(){
    gameStarted = false
    clearInterval(gameIntervalId)
    console.log("Game over")
}

function changeTime(){
    if (time <= 0) gameOver()

    time--
    timeSpan.textContent = time

    drawRandomMole()
}