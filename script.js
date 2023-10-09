/* ----- DOM SELECTORS ------ */
const movement = document.querySelector("#movement");
const startButton = document.getElementById("startButton");
const canvas = document.querySelector("canvas");

/* ----- CANVAS SETUP ------- */
const ctx = canvas.getContext("2d");
canvas.setAttribute("height", getComputedStyle(canvas).height);
canvas.setAttribute("width", getComputedStyle(canvas).width);





/* ----- CLASSES ------------ */
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
    new Player(50 + Math.random() * 100, 150 +  Math.random() * 200, 25, 75, "#217224"),
    new Player(100 + Math.random() * 100, 200 +  Math.random() * 200, 50, 100, "#217224"),
    new Player(300 + Math.random() * 100, 250 +  Math.random() * 200, 75, 125, "#217224"),
    new Player(400 + Math.random() * 100, 300 +  Math.random() * 200, 25, 100, "#217224"),
    new Player(500 + Math.random() * 100, 350 +  Math.random() * 200, 50, 125, "#217224"),
    new Player(600 + Math.random() * 100, 400 +  Math.random() * 200, 75, 150, "#217224")
]
const hut = new Player(0,0, 100, 100, "brown");
const train = new Player(300, 300, 300, 100, "purple")



/* ----- FUNCTIONS ---------- */
function drawBox(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

const currentlyPressedKeys = {}
function movementHandler() {
    const speed = 10;
    if (currentlyPressedKeys["i"]) {
        let isDiagnal = false;
        if (currentlyPressedKeys["j"] || currentlyPressedKeys["l"]) {
            isDiagnal = true;
        }
        skier.y -= isDiagnal ? speed * .75 : speed;
    } 
    if (currentlyPressedKeys["k"]) {
        let isDiagnal = false;
        if (currentlyPressedKeys["j"] || currentlyPressedKeys["l"]) {
            isDiagnal = true;
        }
        skier.y += isDiagnal ? speed * .75 : speed;
    } 
    if (currentlyPressedKeys["j"]) {
        let isDiagnal = false;
        if (currentlyPressedKeys["i"] || currentlyPressedKeys["l"]) {
            isDiagnal = true;
        }
        skier.x -= isDiagnal ? speed * .75 : speed;
    } 
    if (currentlyPressedKeys["l"]) {
        let isDiagnal = false;
        if (currentlyPressedKeys["i"] || currentlyPressedKeys["k"]) {
            isDiagnal = true;
        }
        skier.x += isDiagnal ? speed * .75 : speed;
    } 
}

const gameInterval = setInterval(gameloop, 80);
function gameloop() {
    movementHandler();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    skier.render();
    hut.render();
    let randomTreePath = true
    for (let i = 0; i < trees.length; i++) {
        if (trees[i].enoughTime) {
            //need to add functionality that skier can't move until the "auf geht's" button is clicked
            if (currentlyPressedKeys["k"]) {
                trees[i].y -= 10;
            }
            if (trees[i].y < 150) {
                return trees[i].y = canvas.height;
            }  
            trees[i].render();
        }  
    }
}

//at 0.5 seconds left on the timer, stop rendering trees and render the train station.


/* ----- EVENT LISTENERS ---- */

startButton.addEventListener("click", startCountdown);

function startCountdown() {
    startButton.disabled = true;
    let timeRemaining = 60;
    function updateTimer() {
        const counterElement = document.getElementById("counter");
        const timerElement = document.getElementById("timer");
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        counterElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        timeRemaining--;
        if (timeRemaining < 0) {
            timerElement.hidden = true;
            counterElement.textContent = "Time's up!";
            counterElement.style.color = 'red';
            counterElement.style.paddingTop = '20px';
        // add that the "auf geht's" button disappears and the new "Play again" button appears and restarts the timer at 1:00    
        } else {
            setTimeout(updateTimer, 1000);
        }
    }
    updateTimer();
}

document.addEventListener('keydown', e => currentlyPressedKeys[e.key] = true);
document.addEventListener('keyup', e => currentlyPressedKeys[e.key] = false);