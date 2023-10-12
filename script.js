/* ----- DOM SELECTORS ------ */
const movement = document.querySelector("#movement");
const startButton = document.getElementById("startButton");
const tryAgainButton = document.getElementById("tryAgainButton");
const canvas = document.querySelector("canvas");
const counterElement = document.getElementById("counter");
const timerElement = document.getElementById("timer");
const healthElement = document.getElementById("health");

/* ----- CANVAS SETUP ------- */
const ctx = canvas.getContext("2d");
canvas.setAttribute("height", getComputedStyle(canvas).height);
canvas.setAttribute("width", getComputedStyle(canvas).width);

/* ----- CLASSES ------------ */
let gameStarted = false;
let timeRemaining = 60;
let skiWinner = false;
let countdownTimeout;
let healthScore = 3;

const skierImg = new Image();
skierImg.src = "./images/skierDownhill.png";
const smallTreeImg = new Image();
smallTreeImg.src = "./images/smallTree.png";
const mediumTreeImg = new Image();
mediumTreeImg.src = "./images/mediumTree.png";
const largeTreeImg = new Image();
largeTreeImg.src = "./images/largeTree.png";

class Player {
    constructor(x, y, width, height, color, image) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.image = image;
        this.hasBeenHit = false;
    }
    render() {
        if (this.image) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

const skierX = canvas.width * .30;
const skierY = canvas.height * .15;
const skierWidth = canvas.width * .04;
const skierHeight = canvas.height * .08;
const treeWidthOne = canvas.width * .05;
const treeWidthTwo = canvas.width * .08;
const treeWidthThree = canvas.width * .10;
const treeHeightOne = canvas.height * .08;
const treeHeightTwo = canvas.height * .12;
const treeHeightThree = canvas.height * .2;
const hutWidth = canvas.width * .2;
const hutHeight = canvas.height * .15;
const trainWidth = canvas.width * .35;
const trainHeight = canvas.height * .12;
const trainX = ((canvas.width - trainWidth) - (canvas.width * .1))
const trainY = canvas.height - trainHeight

const skier = new Player(skierX, skierY, skierWidth, skierHeight, "blue", skierImg, false);
const trees = [
    new Player(Math.random() * canvas.width - treeWidthOne, Math.random() * canvas.height + treeHeightOne, treeWidthOne, treeHeightOne, "#217224", smallTreeImg, false),
    new Player(Math.random() * canvas.width - treeWidthTwo, Math.random() * canvas.height + treeHeightTwo, treeWidthTwo, treeHeightTwo, "#217224", mediumTreeImg, false),
    new Player(Math.random() * canvas.width - treeWidthThree, Math.random() * canvas.height + treeHeightThree, treeWidthThree, treeHeightThree, "#217224", largeTreeImg, false),
    new Player(Math.random() * canvas.width - treeWidthOne, Math.random() * canvas.height + treeHeightOne, treeWidthOne, treeHeightOne, "#217224", smallTreeImg, false),
    new Player(Math.random() * canvas.width - treeWidthTwo, Math.random() * canvas.height + treeHeightTwo, treeWidthTwo, treeHeightTwo, "#217224", mediumTreeImg, false),
    new Player(Math.random() * canvas.width - treeWidthThree, Math.random() * canvas.height + treeHeightThree, treeWidthThree, treeHeightThree, "#217224", largeTreeImg, false),
    new Player(Math.random() * canvas.width - treeWidthOne, Math.random() * canvas.height + treeHeightOne, treeWidthOne, treeHeightOne, "#217224", smallTreeImg, false),
    new Player(Math.random() * canvas.width - treeWidthTwo, Math.random() * canvas.height + treeHeightTwo, treeWidthTwo, treeHeightTwo, "#217224", mediumTreeImg, false),
    new Player(Math.random() * canvas.width - treeWidthThree, Math.random() * canvas.height + treeHeightThree, treeWidthThree, treeHeightThree, "#217224", largeTreeImg, false),
    new Player(Math.random() * canvas.width - treeWidthOne, Math.random() * canvas.height + treeHeightOne, treeWidthOne, treeHeightOne, "#217224", smallTreeImg, false),
    new Player(Math.random() * canvas.width - treeWidthTwo, Math.random() * canvas.height + treeHeightTwo, treeWidthTwo, treeHeightTwo, "#217224", mediumTreeImg, false),
    new Player(Math.random() * canvas.width - treeWidthThree, Math.random() * canvas.height + treeHeightThree, treeWidthThree, treeHeightThree, "#217224", largeTreeImg, false),
    new Player(Math.random() * canvas.width - treeWidthOne, Math.random() * canvas.height + treeHeightOne, treeWidthOne, treeHeightOne, "#217224", smallTreeImg, false),
    new Player(Math.random() * canvas.width - treeWidthTwo, Math.random() * canvas.height + treeHeightTwo, treeWidthTwo, treeHeightTwo, "#217224", mediumTreeImg, false),
    new Player(Math.random() * canvas.width - treeWidthThree, Math.random() * canvas.height + treeHeightThree, treeWidthThree, treeHeightThree, "#217224", largeTreeImg, false),
    new Player(Math.random() * canvas.width - treeWidthOne, Math.random() * canvas.height + treeHeightOne, treeWidthOne, treeHeightOne, "#217224", smallTreeImg, false),
    new Player(Math.random() * canvas.width - treeWidthTwo, Math.random() * canvas.height + treeHeightTwo, treeWidthTwo, treeHeightTwo, "#217224", mediumTreeImg, false),
    new Player(Math.random() * canvas.width - treeWidthThree, Math.random() * canvas.height + treeHeightThree, treeWidthThree, treeHeightThree, "#217224", largeTreeImg, false),
]
const hut = new Player(0,0, hutWidth, hutHeight, "brown", false);
const train = new Player(trainX, trainY, trainWidth, trainHeight, "purple", false);

/* ----- FUNCTIONS ---------- */
function startGame() {
    gameStarted = true;
    startCountdown();
    startButton.style.display = "none";
}

const currentlyPressedKeys = {}
function movementHandler() {
    const speed = 20;
    if (currentlyPressedKeys["i"]) {
        let isDiagonal = false;
        if (currentlyPressedKeys["j"] || currentlyPressedKeys["l"]) {
            isDiagonal = true;
        }
        skier.y -= isDiagonal ? speed : speed;
    }
    if (currentlyPressedKeys["k"]) {
        let isDiagonal = false;
        if (currentlyPressedKeys["j"] || currentlyPressedKeys["l"]) {
            isDiagonal = true;
        }
        if (skier.y < (canvas.height/2)) {
            skier.y += isDiagonal ? speed : speed;
        }
    }
    if (currentlyPressedKeys["j"]) {
        let isDiagonal = false;
        if (currentlyPressedKeys["i"] || currentlyPressedKeys["l"]) {
            isDiagonal = true;
        }
        skier.x -= isDiagonal ? speed : speed;
    }
    if (currentlyPressedKeys["l"]) {
        let isDiagonal = false;
        if (currentlyPressedKeys["i"] || currentlyPressedKeys["k"]) {
            isDiagonal = true;
        }
        skier.x += isDiagonal ? speed : speed;
    } 
    if (timeRemaining <= 5) {
        if (currentlyPressedKeys["i"]) {
            let isDiagonal = false;
            if (currentlyPressedKeys["j"] || currentlyPressedKeys["l"]) {
                isDiagonal = true;
            }
            skier.y -= isDiagonal ? speed : speed;
        }
        if (currentlyPressedKeys["k"]) {
            let isDiagonal = false;
            if (currentlyPressedKeys["j"] || currentlyPressedKeys["l"]) {
                isDiagonal = true;
            }
            skier.y += isDiagonal ? speed : speed;
        }
        if (currentlyPressedKeys["j"]) {
            let isDiagonal = false;
            if (currentlyPressedKeys["i"] || currentlyPressedKeys["l"]) {
                isDiagonal = true;
            }
            skier.x -= isDiagonal ? speed : speed;
        }
        if (currentlyPressedKeys["l"]) {
            let isDiagonal = false;
            if (currentlyPressedKeys["i"] || currentlyPressedKeys["k"]) {
                isDiagonal = true;
            }
            skier.x += isDiagonal ? speed : speed;
        }
    }
}

function detectTreeHit(objectOne, objectTwo) {
    const top = (objectOne.y + (objectOne.height * .75)) >= objectTwo.y;
    const bottom = (objectOne.y + (objectOne.height * .25)) <= objectTwo.y + objectTwo.height;
    const left = (objectOne.x + (objectOne.width * .75)) >= objectTwo.x;
    const right = (objectOne.x + (objectOne.width* .25)) <= objectTwo.x + objectTwo.width;
    if (top && bottom && left && right && !objectTwo.hasBeenHit) {
        objectTwo.hasBeenHit = true;
        healthScore--;
        return true;
    }
    return false;
}

function detectTrainHit(objectOne, objectTwo) {
    const top = objectOne.y + objectOne.height >= objectTwo.y;
    const bottom = objectOne.y <= objectTwo.y + objectTwo.height;
    const left = objectOne.x + objectOne.width >= objectTwo.x;
    const right = objectOne.x <= objectTwo.x + objectTwo.width;
        if (top && bottom && left && right) {
            train.hasBeenHit = true;
            return true;
        }
    return false;
}

function healthScoreTracker () {
    if (healthScore === 3) {
        healthElement.textContent = "❤️ ❤️ ❤️";
    } else if (healthScore === 2) {
        healthElement.textContent = "❤️ ❤️";
    } else if (healthScore === 1) {
        healthElement.textContent = "❤️";
    } else {
        healthScore--;
        if (healthScore < 1) {
            healthElement.style.display = "none";
            zeroHealthScore ();
        }
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (currentlyPressedKeys["k"]) {
        hut.y -= 10;
    }
    hut.render();
    for (let i = 0; i < trees.length; i++) {
        if (currentlyPressedKeys["k"]) {
            trees[i].y -= 10;
        }
        if (trees[i].y < 0 - trees[i].height && timeRemaining > 5) {
            trees[i].y = canvas.height;
        }
        if (skier.y >= (canvas.height/2) && timeRemaining > 5) {
            trees[i].y -= 20;
        }
        trees[i].render();
    }
    for (let i = 0; i < trees.length; i++) {
        if (timeRemaining > 0 && detectTreeHit(skier, trees[i])) {
            healthScoreTracker();
        }
    }
    // Stretch Goal -- have the train scroll up onto the screen 
    if (timeRemaining <= 5) {
        train.render();
    }
    if (timeRemaining > 0 && detectTrainHit(skier, train)) {
        skiWinner = true;
    }
    movementHandler();
    skier.render();
}

function winnerView () {
    counterElement.style.paddingTop = '20px';
    timerElement.style.display = "none";
    tryAgainButton.style.display = "inline-block";
}

function zeroHealthScore () {
    counterElement.textContent = "You hit too many trees!";
    counterElement.style.color = 'red';
    winnerView ();
}

function timesUp () {
    counterElement.textContent = "You missed the train!";
    counterElement.style.color = 'orange';
    winnerView ();
}

function winnerMessage () {
    counterElement.textContent = "You made it!";
    counterElement.style.color = 'purple';
    winnerView ();
}

function startCountdown() {
    startButton.disabled = true;
    function updateTimer() {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        counterElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        timeRemaining--;
        countdownTimeout = setTimeout(updateTimer, 500);
        if (timeRemaining < 1 && skiWinner === false) {
            timesUp ();
            clearInterval(countdownTimeout);
        }
        if (healthScore < 1) {
            zeroHealthScore ();
            clearInterval(countdownTimeout);
        } else if (timeRemaining <= 5 && timeRemaining > 0 && skiWinner === true) {
            winnerMessage ();
            clearInterval(countdownTimeout);
        }
    }
    updateTimer();
}

function skierWins() {
    if (timeRemaining > 0 && detectTrainHit(skier,train)) {
        winnerMessage ();
        return skiWinner = true;
    }
    timesUp ();
    return skiWinner = false;
}

function resetGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameStarted = false;
    timeRemaining = 60;
    skiWinner = false;
    countdownTimeout = null;
    healthScore = 3;
    isHit = false;
    healthElement.style.display = "inline-block";
    healthElement.textContent = "❤️ ❤️ ❤️";
    timerElement.style.display = "inline-block";
    counterElement.textContent = "1:00";
    counterElement.style.color = 'black';
    skier.x = 230;
    skier.y = 100;
    hut.y = 0;
    for (let i = 0; i < trees.length; i++) {
        trees[i].x = Math.random() * canvas.width - 75;
        trees[i].y = Math.random() * canvas.height + 200;
    }
    tryAgainButton.style.display = "none";
    startButton.style.display = "inline-block";
    startButton.disabled = false;
}

/* ----- EVENT LISTENERS ---- */
startButton.addEventListener("click", startGame);

tryAgainButton.addEventListener("click", function() {
    resetGame();
    tryAgainButton.style.display = "none";
});   

document.addEventListener('keydown', e => currentlyPressedKeys[e.key] = true);
document.addEventListener('keyup', e => currentlyPressedKeys[e.key] = false);