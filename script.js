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
function detectTreeHit(objectOne, objectTwo) {                                  // collision detection formula for if skier hits any tree
    const top = (objectOne.y + (objectOne.height * .75)) >= objectTwo.y;
    const bottom = (objectOne.y + (objectOne.height * .25)) <= objectTwo.y + objectTwo.height;
    const left = (objectOne.x + (objectOne.width * .75)) >= objectTwo.x;
    const right = (objectOne.x + (objectOne.width* .25)) <= objectTwo.x + objectTwo.width;
    if (top && bottom && left && right && !objectTwo.hasBeenHit) {
        objectTwo.hasBeenHit = true;
        console.log(objectTwo.hasBeenHit);
        return true;
    }
    return false;
}

function detectTrainHit(objectOne, objectTwo) {                                 // collision detection formula for if skier hits the train
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

function healthScoreTracker () {                                                // function that tracks the health score of the game
    if (healthScore === 3) {                                                    // if the healthscore is three
        healthElement.textContent = "❤️ ❤️ ❤️";                                    // show 3 hearts in the infobox
    } else if (healthScore === 2) {                                             // if the healthscore is two
        healthElement.textContent = "❤️ ❤️";                                      // show 2 hearts in the infobox
    } else if (healthScore === 1) {                                             // if the healthscore is one
        healthElement.textContent = "❤️";                                        // show 1 heart1 in the infobox
    } else {                                                                    // otherwise
        zeroHealthScore ();                                                     // invoke the zeroHealthScore function
    }
}

const gameInterval = setInterval(gameloop, 80);                                 // set the game interval to loop every 80 milliseconds
function gameloop() {                                                           // when the function of the gameloop starts  
    if (!gameStarted) {                                                         // if the game has not started
        hut.render();                                                           // render the hut &
        skier.render();                                                         // render the player (aka skier) &
        for (let i = 0; i < trees.length; i++) {                                // for the array of trees
            trees[i].render();                                                  // render them randomly on the screen 
        }
        return;                                                                 // do not allow the user to move the skier with the j, k, i, or l keys until the start button is clicked
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);                           // clears the game board every time it loops for smooth "movement" of elements like sking downhill
    if (currentlyPressedKeys["k"]) {                                            // if the k key is pressed down
        hut.y -= 10;                                                            // have the hut scroll up at - 10px &
    }
    hut.render();                                                               // render image of hut until it's gone from view
    for (let i = 0; i < trees.length; i++) {                                    // for the array of trees
        if (currentlyPressedKeys["k"]) {                                        // if k key is pressed the trees scroll at the game start when skier starts moving
            trees[i].y -= 10;                                                   // have the trees scroll up at - 10px
        }
        if (trees[i].y < 0 - trees[i].height && timeRemaining > 5) {            // if the y (top of the tree) minus the y.height (bottom of the tree) && the timer is above 0:05
            trees[i].y = canvas.height;                                         // render new trees as the gameboard scrolls
        }
        if (skier.y >= (canvas.height/2) && timeRemaining > 5) {                // if the skier's y (top of the skier) is greater than the halfway point of the canvas & the timer is above 0:05
            trees[i].y -= 20;                                                   // trees "move faster" with skier and skier moves automatically
        }
        trees[i].render();                                                      // renders new trees when the gameloops
    }
    // Stretch Goal - if a tree hit is detected, lose one point on healthscare
    for (let i = 0; i < trees.length; i++) {
        if (timeRemaining > 0 && detectTreeHit(skier, trees[i])) {
            healthScoreTracker();
        }
    }
    // Stretch Goal -- have the train scroll up onto the screen 
    if (timeRemaining <= 5) {                                                   // if there's 5 seconds left on the clock
        // train.y -= 10;       // has train scroll all the way up
        train.render();                                                         // have the train appear
    }
    if (timeRemaining > 0 && detectTrainHit(skier, train)) {                    // if the timer is above 0:00 and the skier has hit the train station   
        skiWinner = true;                                                       // skiWinner = true
        // console.log(train.hasBeenHit);
    }
    movementHandler();                                                          // invokes the movementHandler function
    skier.render();                                                             // invokes the skier to render on the screen
}

function winnerView () {                                                        // if the winnerView function is invoked
    counterElement.style.paddingTop = '20px';                                   // add 20px of padding above the counterElement
    timerElement.style.display = "none";                                        // do not display the timerElement
    tryAgainButton.style.display = "inline-block";                              // display the "Try Again" button
}
function zeroHealthScore () {                                                   // if the zeroHealthScore function is invoked
    counterElement.textContent = "You hit too many trees!";                     // have the counterElement show the text "You hit too many trees!"
    counterElement.style.color = 'red';                                         // make the counterElement text red
    winnerView ();                                                              // invoke the winnerView function
}

function timesUp () {                                                           // if the timesUp function is invoked
    counterElement.textContent = "You missed the train!";                       // have the counterElement show the text "You missed the train!"
    counterElement.style.color = 'orange';                                      // make the counterElement text orange
    winnerView ();                                                              // invoke the winnerView function
}

function winnerMessage () {                                                     // if the timesUp function is invoked
    counterElement.textContent = "You made it!";                                // have the counterElement show the text "You made it!"
    counterElement.style.color = 'purple';                                      // make the counterElement text purple
    winnerView ();                                                              // invoke the winnerView function
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