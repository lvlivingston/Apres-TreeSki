/* ----- DOM SELECTORS ------ */
const movement = document.querySelector("#movement");
const startButton = document.getElementById("startButton");
const tryAgainButton = document.getElementById("tryAgainButton");
const canvas = document.querySelector("canvas");
const counterElement = document.getElementById("counter");
const timerElement = document.getElementById("timer");

/* ----- CANVAS SETUP ------- */
const ctx = canvas.getContext("2d");
canvas.setAttribute("height", getComputedStyle(canvas).height);
canvas.setAttribute("width", getComputedStyle(canvas).width);

/* ----- CLASSES ------------ */
let gameStarted = false;
let enoughTime = true;
let timeRemaining = 60;

class Player {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.enoughTime = true;
    }
    render() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

const skier = new Player(230, 100, 30, 60, "blue");
const trees = [
    new Player(Math.random() * canvas.width - 25, Math.random() * canvas.height + 200, 25, 75, "#217224"),
    new Player(Math.random() * canvas.width - 50, Math.random() * canvas.height + 200, 50, 100, "#217224"),
    new Player(Math.random() * canvas.width - 75, Math.random() * canvas.height + 200, 75, 125, "#217224"),
    new Player(Math.random() * canvas.width - 25, Math.random() * canvas.height + 200, 25, 75, "#217224"),
    new Player(Math.random() * canvas.width - 50, Math.random() * canvas.height + 200, 50, 100, "#217224"),
    new Player(Math.random() * canvas.width - 75, Math.random() * canvas.height + 200, 75, 125, "#217224"),
    new Player(Math.random() * canvas.width - 25, Math.random() * canvas.height + 200, 25, 75, "#217224"),
    new Player(Math.random() * canvas.width - 50, Math.random() * canvas.height + 200, 50, 100, "#217224"),
    new Player(Math.random() * canvas.width - 75, Math.random() * canvas.height + 200, 75, 125, "#217224"),
    new Player(Math.random() * canvas.width - 25, Math.random() * canvas.height + 200, 25, 75, "#217224"),
    new Player(Math.random() * canvas.width - 50, Math.random() * canvas.height + 200, 50, 100, "#217224"),
    new Player(Math.random() * canvas.width - 75, Math.random() * canvas.height + 200, 75, 125, "#217224"),
    new Player(Math.random() * canvas.width - 25, Math.random() * canvas.height + 200, 25, 75, "#217224"),
    new Player(Math.random() * canvas.width - 50, Math.random() * canvas.height + 200, 50, 100, "#217224"),
    new Player(Math.random() * canvas.width - 75, Math.random() * canvas.height + 200, 75, 125, "#217224"),
    new Player(Math.random() * canvas.width - 25, Math.random() * canvas.height + 200, 25, 75, "#217224"),
    new Player(Math.random() * canvas.width - 50, Math.random() * canvas.height + 200, 50, 100, "#217224"),
    new Player(Math.random() * canvas.width - 75, Math.random() * canvas.height + 200, 75, 125, "#217224"),
]
const hut = new Player(0,0, 100, 100, "brown");
const train = new Player(canvas.width - 320, canvas.height - 100, 300, 100, "purple")

/* ----- FUNCTIONS ---------- */
hut.enoughTime = true;
train.enoughTime = false;

function startGame() {
    console.log("click")
    gameStarted = true;
    skier.x = 230;
    skier.y = 100;
    startCountdown();
    startButton.style.display = "none";
}

const currentlyPressedKeys = {}
function movementHandler() {
    //need to figure out why skier doesn't stop moving at end of the game
    const speed = 20;
    if (timeRemaining <= 5) {
        skier.y += speed;
    } else if (currentlyPressedKeys["i"]) {
        let isDiagnal = false;
        if (currentlyPressedKeys["j"] || currentlyPressedKeys["l"]) {
            isDiagnal = true;
        }
        skier.y -= isDiagnal ? speed : speed;
    } 
    if (currentlyPressedKeys["k"]) {
        let isDiagnal = false;
        if (currentlyPressedKeys["j"] || currentlyPressedKeys["l"]) {
            isDiagnal = true;
        }
        if (skier.y < (canvas.height/2)) {
            skier.y += isDiagnal ? speed : speed;
        }
    } 
    if (currentlyPressedKeys["j"]) {
        let isDiagnal = false;
        if (currentlyPressedKeys["i"] || currentlyPressedKeys["l"]) {
            isDiagnal = true;
        }
        skier.x -= isDiagnal ? speed : speed;
    } 
    if (currentlyPressedKeys["l"]) {
        let isDiagnal = false;
        if (currentlyPressedKeys["i"] || currentlyPressedKeys["k"]) {
            isDiagnal = true;
        }
        skier.x += isDiagnal ? speed : speed;
    } 
}

const gameInterval = setInterval(gameloop, 80);
function gameloop() {
    if (!gameStarted) {
        hut.render();
        skier.render();
        for (let i = 0; i < trees.length; i++) {
            trees[i].render();
        }
        return;
    }
    movementHandler();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let randomTreePath = true;
    if (hut.enoughTime) {
        if (currentlyPressedKeys["k"]) {
            hut.y -= 10;
        }
        if (hut.y + hut.height < 0) {
            hut.enoughTime = false; 
        }
        hut.render();
    }
    for (let i = 0; i < trees.length; i++) {
        if (currentlyPressedKeys["k"]) {
            trees[i].y -= 10;
        }
        if (trees[i].y < 0 - trees[i].height && timeRemaining > 5) {
            trees[i].y = canvas.height;
        }
        trees[i].render();
    }
    if (timeRemaining <= 5) {
            train.render();
        }
    skier.render();
}

function startCountdown() {
    startButton.disabled = true;
    function updateTimer() {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        counterElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        timeRemaining--;
        if (timeRemaining < 0) {
            timerElement.hidden = true;
            counterElement.textContent = "Time's up!";
            counterElement.style.color = 'red';
            counterElement.style.paddingTop = '20px';
            tryAgainButton.style.display = "inline-block";
        } else {
            setTimeout(updateTimer, 250);
        }
    }
    updateTimer();
}

//need to add collision function for trees

//need to add collision function for train

function resetGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameStarted = false;
    timeRemaining = 60;
    timerElement.hidden = false;
    counterElement.textContent = "1:00";
    counterElement.style.color = 'black';
    skier.x = 230;
    skier.y = 100;
    hut.y = 0;
    hut.enoughTime = true;
    for (let i = 0; i < trees.length; i++) {
        trees[i].x = Math.random() * canvas.width - 75;
        trees[i].y = Math.random() * canvas.height + 200;
    }
    train.enoughTime = false;
    tryAgainButton.style.display = "none";
    startButton.style.display = "inline-block";
    startButton.disabled = false;
}

/* ----- EVENT LISTENERS ---- */
startButton.addEventListener("click", startGame);

tryAgainButton.addEventListener("click", function() {
    console.log("click")
    resetGame();
    tryAgainButton.style.display = "none";
});

document.addEventListener('keydown', e => currentlyPressedKeys[e.key] = true);
document.addEventListener('keyup', e => currentlyPressedKeys[e.key] = false);