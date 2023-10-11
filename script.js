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
//Stretch Goal - Add in healthscore option with tree collision that will automatically end the game if healthscore equals zero
let healthScore = 3; 

class Player {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.hasBeenHit = false;
    }
    render() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

const skier = new Player(230, 100, 30, 60, "blue", false);
const trees = [
    new Player(Math.random() * canvas.width - 25, Math.random() * canvas.height + 200, 25, 75, "#217224", false),
    new Player(Math.random() * canvas.width - 50, Math.random() * canvas.height + 200, 50, 100, "#217224", false),
    new Player(Math.random() * canvas.width - 75, Math.random() * canvas.height + 200, 75, 125, "#217224", false),
    new Player(Math.random() * canvas.width - 25, Math.random() * canvas.height + 200, 25, 75, "#217224", false),
    new Player(Math.random() * canvas.width - 50, Math.random() * canvas.height + 200, 50, 100, "#217224", false),
    new Player(Math.random() * canvas.width - 75, Math.random() * canvas.height + 200, 75, 125, "#217224", false),
    new Player(Math.random() * canvas.width - 25, Math.random() * canvas.height + 200, 25, 75, "#217224", false),
    new Player(Math.random() * canvas.width - 50, Math.random() * canvas.height + 200, 50, 100, "#217224", false),
    new Player(Math.random() * canvas.width - 75, Math.random() * canvas.height + 200, 75, 125, "#217224", false),
    new Player(Math.random() * canvas.width - 25, Math.random() * canvas.height + 200, 25, 75, "#217224", false),
    new Player(Math.random() * canvas.width - 50, Math.random() * canvas.height + 200, 50, 100, "#217224", false),
    new Player(Math.random() * canvas.width - 75, Math.random() * canvas.height + 200, 75, 125, "#217224", false),
    new Player(Math.random() * canvas.width - 25, Math.random() * canvas.height + 200, 25, 75, "#217224", false),
    new Player(Math.random() * canvas.width - 50, Math.random() * canvas.height + 200, 50, 100, "#217224", false),
    new Player(Math.random() * canvas.width - 75, Math.random() * canvas.height + 200, 75, 125, "#217224", false),
    new Player(Math.random() * canvas.width - 25, Math.random() * canvas.height + 200, 25, 75, "#217224", false),
    new Player(Math.random() * canvas.width - 50, Math.random() * canvas.height + 200, 50, 100, "#217224", false),
    new Player(Math.random() * canvas.width - 75, Math.random() * canvas.height + 200, 75, 125, "#217224", false),
]
const hut = new Player(0,0, 100, 100, "brown", false);
const train = new Player(canvas.width - 320, canvas.height - 100, 300, 100, "purple", false)

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

//STRETCH GOAL - Add collision function for trees to slow skier down
function detectTreeHit(objectOne, objectTwo) {
    const top = (objectOne.y + (objectOne.height * .75)) >= objectTwo.y;
    const bottom = (objectOne.y + (objectOne.height * .25)) <= objectTwo.y + objectTwo.height;
    const left = (objectOne.x + (objectOne.width * .75)) >= objectTwo.x;
    const right = (objectOne.x + (objectOne.width* .25)) <= objectTwo.x + objectTwo.width;
    for (let i = 0; i < trees.length; i++) {
    if (trees[i].hasBeenHit) {
        trees[i].hasBeenHit = true;
        healthScoreTracker();
    } else if (!top || !bottom || !left || !right) {
        trees[i].hasBeenHit = false;
    }
    }
    return false;
}
console.log(detectTreeHit);
console.log(healthScoreTracker);

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

//Function to track healthscore
function healthScoreTracker () {
    if (healthScore === 3) {
        healthElement.textContent = "❤️ ❤️ ❤️";
    } else if (healthScore === 2) {
        healthElement.textContent = "❤️ ❤️";
    } else if (healthScore === 1) {
        healthElement.textContent = "❤️";
    } else {
        zeroHealthScore ();
    }
}

const gameInterval = setInterval(gameloop, 80);         // set the game interval to loop every 80 milliseconds
function gameloop() {                                   // when the function of the gameloop starts  
    if (!gameStarted) {                                 // if the game has not started
        hut.render();                                   // render the hut &
        skier.render();                                 // render the player (aka skier) &
        for (let i = 0; i < trees.length; i++) {        // randomly generate the trees
            trees[i].render();
        }
        return;                                         // do not allow the user to move the skier with the j, k, i, or l keys until the start button is clicked
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);   // clears the game board every time it loops for smooth "movement" of elements like sking downhill
    if (currentlyPressedKeys["k"]) {
        hut.y -= 10;
    }
    hut.render();
    for (let i = 0; i < trees.length; i++) {
        if (currentlyPressedKeys["k"]) {                                        // makes the trees scroll at the game start when skier starts moving
            trees[i].y -= 10;
        }
        if (trees[i].y < 0 - trees[i].height && timeRemaining > 5) {            // renders new trees as the gameboard scrolls
            trees[i].y = canvas.height;
        }
        if (skier.y >= (canvas.height/2) && timeRemaining > 5) {                // allows skier move automatically at the canvas.height/2
            trees[i].y -= 20;                                                   // makes skier move "faster" when k key is pressed
        }
        trees[i].render();                                                      // renders new
    }
    // Stretch Goal - if a tree hit is detected, lose one point on healthscare
    for (let i = 0; i < trees.length; i++) {
        if (timeRemaining > 0 && detectTreeHit(skier, trees[i])) {
        healthScoreTracker();
        // console.log(healthScoreTracker);
        }
    }
    if (timeRemaining <= 5) {
        train.render();
    }
    if (timeRemaining > 0 && detectTrainHit(skier, train)) {
        skiWinner = true;
        console.log(train.hasBeenHit);
    }
    movementHandler();
    skier.render();
}

function zeroHealthScore () {
    counterElement.textContent = "You hit too many trees!";
    counterElement.style.color = 'red';
    counterElement.style.paddingTop = '20px';
    timerElement.style.display = "none";
    tryAgainButton.style.display = "inline-block";
}

function timesUp () {
    counterElement.textContent = "You missed the train!";
    counterElement.style.color = 'orange';
    counterElement.style.paddingTop = '20px';
    timerElement.style.display = "none";
    tryAgainButton.style.display = "inline-block";
}

function winnerMessage () {
    counterElement.textContent = "You made it!";
    counterElement.style.color = 'purple';
    counterElement.style.paddingTop = '20px';
    timerElement.style.display = "none";
    tryAgainButton.style.display = "inline-block";
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
        // update message to end game if too many trees hit    
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
    healthElement.textContent = "❤️ ❤️ ❤️";
    timerElement.style.display = "inline-block";
    counterElement.textContent = "1:00";
    counterElement.style.color = 'black';
    skier.x = 230;
    skier.y = 100;
    hut.y = 0;
    // hut.enoughTime = true;
    for (let i = 0; i < trees.length; i++) {
        trees[i].x = Math.random() * canvas.width - 75;
        trees[i].y = Math.random() * canvas.height + 200;
    }
    // train.enoughTime = false;
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