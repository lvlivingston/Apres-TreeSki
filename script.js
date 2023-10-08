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
    new Player(200 + Math.random() * 100, 300 +  Math.random() * 200, 25, 100, "#217224")
]
const hut = new Player(0,0, 100, 100, "brown");
// const trainStation = 



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
            if (currentlyPressedKeys["k"]) {
                trees[i].y -= 10;
            }
            if (trees[i].y + trees[i].height === 0) {
                trees[i].width = 200;
            }   
            trees[i].render();
        }  
    }
    // if (trees[i].enoughTime) {
    //     randomTreePath = false;
    // }
}

//at 55 seconds, set train station to true, if true render train station


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
            // Hide the timer element
            timerElement.hidden = true;
            // Display "Time's up!" in red with 20px padding above it
            counterElement.textContent = "Time's up!";
            counterElement.style.color = 'red';
            counterElement.style.paddingTop = '20px';
        } else {
            setTimeout(updateTimer, 1000);
        }
    }

    updateTimer();
}

document.addEventListener('keydown', e => currentlyPressedKeys[e.key] = true);
document.addEventListener('keyup', e => currentlyPressedKeys[e.key] = false);