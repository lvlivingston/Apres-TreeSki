/* ----- DOM SELECTORS ------ */
const movement = document.querySelector("#movement");                                                                   // selects the HTML element with the id 'movement'
const startButton = document.getElementById("startButton");                                                             // selects the HTML element with the id 'startButton'
const tryAgainButton = document.getElementById("tryAgainButton");                                                       // selects the HTML element with the id 'tryAgainButton'
const canvas = document.querySelector("canvas");                                                                        // selects the HTML element with the id 'canvas'
const counterElement = document.getElementById("counter");                                                              // selects the HTML element with the id 'counter'
const timerElement = document.getElementById("timer");                                                                  // selects the HTML element with the id 'timer'
const healthElement = document.getElementById("health");                                                                // selects the HTML element with the id 'health'

/* ----- CANVAS SETUP ------- */
const ctx = canvas.getContext("2d");                                                                                    // renders the 2d context from the HTML canvas element          
canvas.setAttribute("height", getComputedStyle(canvas).height);                                                         // sets the height attribute of the HTML canvas based on CSS height property
canvas.setAttribute("width", getComputedStyle(canvas).width);                                                           // sets the width attribute of the HTML canvas based on CSS width property

/* ----- CLASSES ------------ */
let gameStarted = false;                                                                                                // declares gameStarted variable and initializes the value as false
let timeRemaining = 60;                                                                                                 // declares timeRemaining variable and initializes the value as 60
let skiWinner = false;                                                                                                  // declares skiWinner variable and initializes the value as false
let countdownTimeout;                                                                                                   // declares countdownTimout variable and initializes the value as null
let healthScore = 3;                                                                                                    // declares healthScore variable and initializes the value as 3

class Player {                                                                                                          // defines the Player class to create additional objects
    constructor(x, y, width, height, color) {                                                                           // method that's called for each new object 
        this.x = x;                                                                                                     // assigns the value to the x parameter for each respective objects' property
        this.y = y;                                                                                                     // aassigns the value to the y parameter for each respective objects' property     
        this.width = width;                                                                                             // assigns the value to the width parameter for each respective objects' property
        this.height = height;                                                                                           // assigns the value to the height parameter for each respective objects' property
        this.color = color;                                                                                             // assigns the value to the color parameter for each respective objects' property
        this.hasBeenHit = false;                                                                                        // initializes hasBeenHit property with a default value as false
    }
    render() {                                                                                                          // invokes the render function
        ctx.fillStyle = this.color;                                                                                     // sets the fill color of each object
        ctx.fillRect(this.x, this.y, this.width, this.height);                                                          // draws the object
    }
}

const skier = new Player(230, 100, 30, 60, "blue", false);                                                              // creates a new object called skier based on the Player class
const trees = [                     
    new Player(Math.random() * canvas.width - 25, Math.random() * canvas.height + 200, 25, 75, "#217224", false),       // creates a new object called trees based on the Player class
    new Player(Math.random() * canvas.width - 50, Math.random() * canvas.height + 200, 50, 100, "#217224", false),      // "
    new Player(Math.random() * canvas.width - 75, Math.random() * canvas.height + 200, 75, 125, "#217224", false),      // "
    new Player(Math.random() * canvas.width - 25, Math.random() * canvas.height + 200, 25, 75, "#217224", false),       // "
    new Player(Math.random() * canvas.width - 50, Math.random() * canvas.height + 200, 50, 100, "#217224", false),      // "
    new Player(Math.random() * canvas.width - 75, Math.random() * canvas.height + 200, 75, 125, "#217224", false),      // "
    new Player(Math.random() * canvas.width - 25, Math.random() * canvas.height + 200, 25, 75, "#217224", false),       // "
    new Player(Math.random() * canvas.width - 50, Math.random() * canvas.height + 200, 50, 100, "#217224", false),      // "
    new Player(Math.random() * canvas.width - 75, Math.random() * canvas.height + 200, 75, 125, "#217224", false),      // "
    new Player(Math.random() * canvas.width - 25, Math.random() * canvas.height + 200, 25, 75, "#217224", false),       // "
    new Player(Math.random() * canvas.width - 50, Math.random() * canvas.height + 200, 50, 100, "#217224", false),      // "
    new Player(Math.random() * canvas.width - 75, Math.random() * canvas.height + 200, 75, 125, "#217224", false),      // "
    new Player(Math.random() * canvas.width - 25, Math.random() * canvas.height + 200, 25, 75, "#217224", false),       // "
    new Player(Math.random() * canvas.width - 50, Math.random() * canvas.height + 200, 50, 100, "#217224", false),      // "
    new Player(Math.random() * canvas.width - 75, Math.random() * canvas.height + 200, 75, 125, "#217224", false),      // "
    new Player(Math.random() * canvas.width - 25, Math.random() * canvas.height + 200, 25, 75, "#217224", false),       // "
    new Player(Math.random() * canvas.width - 50, Math.random() * canvas.height + 200, 50, 100, "#217224", false),      // "
    new Player(Math.random() * canvas.width - 75, Math.random() * canvas.height + 200, 75, 125, "#217224", false),      // "
]
const hut = new Player(0,0, 100, 100, "brown", false);                                                                  // creates a new object called hut based on the Player class
const train = new Player(canvas.width - 320, canvas.height - 100, 300, 100, "purple", false);                           // creates a new object called train based on the Player class

/* ----- FUNCTIONS ---------- */
function startGame() {                                                                                                  // function that starts the game
    gameStarted = true;                                                                                                 // change gameStarted to be true
    startCountdown();                                                                                                   // invoke the startCountdown function
    startButton.style.display = "none";                                                                                 // do not display the "Auf Geht's" button
}

const currentlyPressedKeys = {}                                                                                         // creates the variable currentlyPressedKeys
function movementHandler() {                                                                                            // function to allow skier to move 
    const speed = 20;                                                                                                   // the initial speed of the skier is 20
    if (currentlyPressedKeys["i"]) {                                                                                    // if the i key is pressed
        let isDiagonal = false;                                                                                         // declare a new variable called isDiagonal with an initial value as false;
        if (currentlyPressedKeys["j"] || currentlyPressedKeys["l"]) {
            isDiagonal = true;
        }
        skier.y -= isDiagonal ? speed : speed;
    } 
    if (currentlyPressedKeys["k"]) {
        let isDiagonal = false;                                                                                         // declare a new variable called isDiagonal with an initial value as false;
        if (currentlyPressedKeys["j"] || currentlyPressedKeys["l"]) {
            isDiagonal = true;
        }
        if (skier.y < (canvas.height/2)) {
            skier.y += isDiagonal ? speed : speed;
        }
    } 
    if (currentlyPressedKeys["j"]) {
        let isDiagonal = false;                                                                                         // declare a new variable called isDiagonal with an initial value as false;
        if (currentlyPressedKeys["i"] || currentlyPressedKeys["l"]) {
            isDiagonal = true;
        }
        skier.x -= isDiagonal ? speed : speed;
    } 
    if (currentlyPressedKeys["l"]) {
        let isDiagonal = false;                                                                                         // declare a new variable called isDiagonal with an initial value as false;
        if (currentlyPressedKeys["i"] || currentlyPressedKeys["k"]) {
            isDiagonal = true;
        }
        skier.x += isDiagonal ? speed : speed;
    } 
    if (timeRemaining <= 5) {
        if (currentlyPressedKeys["i"]) {                                                                                
            let isDiagonal = false;                                                                                     // declare a new variable called isDiagonal with an initial value as false;
            if (currentlyPressedKeys["j"] || currentlyPressedKeys["l"]) {
                isDiagonal = true;
            }
            skier.y -= isDiagonal ? speed : speed;
        } 
        if (currentlyPressedKeys["k"]) {
            let isDiagonal = false;                                                                                     // declare a new variable called isDiagonal with an initial value as false;
            if (currentlyPressedKeys["j"] || currentlyPressedKeys["l"]) {
                isDiagonal = true;
            }
            skier.y += isDiagonal ? speed : speed;
        } 
        if (currentlyPressedKeys["j"]) {
            let isDiagonal = false;                                                                                     // declare a new variable called isDiagonal with an initial value as false;
            if (currentlyPressedKeys["i"] || currentlyPressedKeys["l"]) {
                isDiagonal = true;
            }
            skier.x -= isDiagonal ? speed : speed;
        } 
        if (currentlyPressedKeys["l"]) {
            let isDiagonal = false;                                                                                     // declare a new variable called isDiagonal with an initial value as false;
            if (currentlyPressedKeys["i"] || currentlyPressedKeys["k"]) {
                isDiagonal = true;
            }
            skier.x += isDiagonal ? speed : speed;
        } 
    }
}

//STRETCH GOAL - Add collision function for trees to slow skier down
function detectTreeHit(objectOne, objectTwo) {                                                      // collision detection formula for if skier hits any tree
    const top = (objectOne.y + (objectOne.height * .75)) >= objectTwo.y;                            // more than 25% of the skier runs into the top of a tree
    const bottom = (objectOne.y + (objectOne.height * .25)) <= objectTwo.y + objectTwo.height;      // more than 25% of the skier runs into the bottom of a tree
    const left = (objectOne.x + (objectOne.width * .75)) >= objectTwo.x;                            // more than 25% of the skier runs into the left of a tree
    const right = (objectOne.x + (objectOne.width* .25)) <= objectTwo.x + objectTwo.width;          // more than 25% of the skier runs into the right of a tree
    if (top && bottom && left && right && !objectTwo.hasBeenHit) {                                  // if all of the above are true (i.e. is the skier has hit a tree) && the tree has not yet been hit
        objectTwo.hasBeenHit = true;                                                                // change objectTwo.hasBeenHit to be true
        healthScore--;                                                                              // reduce the healthScore by one
        return true;                                                                                // and detectTreeHit is true
    }
    return false;                                                                                   // otherwise, detectTreeHit is false
}

function detectTrainHit(objectOne, objectTwo) {                                                     // collision detection formula for if skier hits the train
    const top = objectOne.y + objectOne.height >= objectTwo.y;                                      // skier hits the top of the train
    const bottom = objectOne.y <= objectTwo.y + objectTwo.height;                                   // skier hits the bottom of the train
    const left = objectOne.x + objectOne.width >= objectTwo.x;                                      // skier hits the left of the train
    const right = objectOne.x <= objectTwo.x + objectTwo.width;                                     // skier hits the right of the train
        if (top && bottom && left && right) {                                                       // if all of the above are true (i.e. is the skier standing in front of the train)
            train.hasBeenHit = true;                                                                // change train.hasBeenHit to be true
            return true;                                                                            // and detectTrainHit is true
        }
    return false;                                                                                   // otherwise, detectTrainHit is false
}

function healthScoreTracker () {                                                                    // function that tracks the health score of the game
    if (healthScore === 3) {                                                                        // if the healthscore is three
        healthElement.textContent = "❤️ ❤️ ❤️";                                                        // show 3 hearts in the infobox
    } else if (healthScore === 2) {                                                                 // if the healthscore is two
        healthElement.textContent = "❤️ ❤️";                                                          // show 2 hearts in the infobox
    } else if (healthScore === 1) {                                                                 // if the healthscore is one
        healthElement.textContent = "❤️";                                                            // show 1 heart1 in the infobox
    } else {                                                                                        // otherwise
        healthScore--;                                                                              // reduce the healthScore by one
        if (healthScore < 1) {                                                                      // if the healhScore is zero
            healthElement.style.display = "none";                                                   // do not display the healthElement 
            zeroHealthScore ();                                                                     // invoke the zeroHealthScore function
        }                                                                      
    }
}

const gameInterval = setInterval(gameloop, 80);                                                     // set the game interval to loop every 80 milliseconds
function gameloop() {                                                                               // function that runs the gameloop  
    if (!gameStarted) {                                                                             // if the game has not started
        hut.render();                                                                               // render the hut &
        skier.render();                                                                             // render the player (aka skier) &
        for (let i = 0; i < trees.length; i++) {                                                    // for the array of trees
            trees[i].render();                                                                      // render them randomly on the screen 
        }
        return;                                                                                     // do not allow the user to move the skier with the j, k, i, or l keys until the start button is clicked
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);                                               // clears the game board every time it loops for smooth "movement" of elements like sking downhill
    if (currentlyPressedKeys["k"]) {                                                                // if the k key is pressed down
        hut.y -= 10;                                                                                // have the hut scroll up at - 10px &
    }
    hut.render();                                                                                   // render image of hut until it's gone from view
    for (let i = 0; i < trees.length; i++) {                                                        // for the array of trees
        if (currentlyPressedKeys["k"]) {                                                            // if k key is pressed the trees scroll at the game start when skier starts moving
            trees[i].y -= 10;                                                                       // have the trees scroll up at - 10px
        }
        if (trees[i].y < 0 - trees[i].height && timeRemaining > 5) {                                // if the y (top of the tree) minus the y.height (bottom of the tree) && the timer is above 0:05
            trees[i].y = canvas.height;                                                             // render new trees as the gameboard scrolls
        }
        if (skier.y >= (canvas.height/2) && timeRemaining > 5) {                                    // if the skier's y (top of the skier) is greater than the halfway point of the canvas & the timer is above 0:05
            trees[i].y -= 20;                                                                       // trees "move faster" with skier and skier moves automatically
        }
        trees[i].render();                                                                          // renders new trees when the gameloops
    }
    for (let i = 0; i < trees.length; i++) {                                                        // for any of the items in the trees array
        if (timeRemaining > 0 && detectTreeHit(skier, trees[i])) {                                  // if there's more than 0:01 on the timer and the skier has hit one tree
            healthScoreTracker();                                                                   // invoke the healthScoreTracker function
        }
    }
    // Stretch Goal -- have the train scroll up onto the screen 
    if (timeRemaining <= 5) {                                                                       // if there's 0:05 seconds left on the timer
        train.render();                                                                             // have the train appear
    }
    if (timeRemaining > 0 && detectTrainHit(skier, train)) {                                        // if the timer is above 0:00 and the skier has hit the train station   
        skiWinner = true;                                                                           // skiWinner = true
        // console.log(train.hasBeenHit);
    }
    movementHandler();                                                                              // invokes the movementHandler function
    skier.render();                                                                                 // invokes the skier to render on the screen
}

function winnerView () {                                                                            // when the winnerView function is invoked
    counterElement.style.paddingTop = '20px';                                                       // add 20px of padding above the counterElement
    timerElement.style.display = "none";                                                            // do not display the timerElement
    tryAgainButton.style.display = "inline-block";                                                  // display the "Try Again" button
}
function zeroHealthScore () {                                                                       // when the zeroHealthScore function is invoked
    counterElement.textContent = "You hit too many trees!";                                         // have the counterElement show the text "You hit too many trees!"
    counterElement.style.color = 'red';                                                             // make the counterElement text red
    winnerView ();                                                                                  // invoke the winnerView function
}

function timesUp () {                                                                               // when the timesUp function is invoked
    counterElement.textContent = "You missed the train!";                                           // have the counterElement show the text "You missed the train!"
    counterElement.style.color = 'orange';                                                          // make the counterElement text orange
    winnerView ();                                                                                  // invoke the winnerView function
}

function winnerMessage () {                                                                         // when the timesUp function is invoked
    counterElement.textContent = "You made it!";                                                    // have the counterElement show the text "You made it!"
    counterElement.style.color = 'purple';                                                          // make the counterElement text purple
    winnerView ();                                                                                  // invoke the winnerView function
}

function startCountdown() {                                                                         // when the startCountdown function is invoked
    startButton.disabled = true;                                                                    // the startButton is disabled / hidden
    function updateTimer() {                                                                        // the updateTime function invokes
        const minutes = Math.floor(timeRemaining / 60);                                             // calculates the whole number of minutes in timeRemaining by dividing it by 60 and rounding down to the nearest whole number
        const seconds = timeRemaining % 60;                                                         // calculates the remaining seconds after removing the whole minutes 
        counterElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;             // displays the current time left via a template literal and ternary operator
        timeRemaining--;                                                                            // decreases the timeRemaining variable by 1 
        countdownTimeout = setTimeout(updateTimer, 500);                                            // sets up the timer to call the updateTimer function again after 500 milliseconds
        if (timeRemaining < 1 && skiWinner === false) {                                             // if there's more than 0:01 on the timer and the skier has not reached the train station
            timesUp ();                                                                             // invoke the timesUp function
            clearInterval(countdownTimeout);                                                        // clears the timer from updating every 500 milliseconds 
        }   
        if (healthScore < 1) {                                                                      // in the skier runs out of lives
            zeroHealthScore ();                                                                     // invoke the zeroHealthScore function
            clearInterval(countdownTimeout);                                                        // clears the timer from updating every 500 milliseconds
        } else if (timeRemaining > 0 && skiWinner === true) {                                       // if there's more than 0:01 on the timer and the skier has reached the train station 
            winnerMessage ();                                                                       // invoke the winnerMessage function
            clearInterval(countdownTimeout);                                                        // clears the timer from updating every 500 milliseconds
        }
    }
    updateTimer();                                                                                  // invoke the updateTimer function to start the timer at game start
}

function skierWins() {                                                                              // when the skierWins function is invoked
    if (timeRemaining > 0 && detectTrainHit(skier,train)) {                                         // if the timeRemaining is above zero and there is a collision detection with the skier and the train
        winnerMessage ();                                                                           // invoke the winnerMessage function
        return skiWinner = true;                                                                    // and change skiWinner to be true
    }
    timesUp ();                                                                                     // otherwise, invoke the timesUp function
    return skiWinner = false;                                                                       // and leave skiWinner as false
}

function resetGame() {                                                                              // function that resets the game to the default settings
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
startButton.addEventListener("click", startGame);                                                   // when the user clicks the "Auf Geht's" button, the game starts

tryAgainButton.addEventListener("click", function() {                                               // when the user clicks the "Try Again" button
    resetGame();                                                                                    // invoke the resetGame function to reset the game to the default settings
    tryAgainButton.style.display = "none";                                                          // do not display the "Try Again" button
});

document.addEventListener('keydown', e => currentlyPressedKeys[e.key] = true);                      // allows the document object in the webpage to listen to when a key on the keyboard is pressed
document.addEventListener('keyup', e => currentlyPressedKeys[e.key] = false);                       // allows the document object in the webpage to listen to when a key on the keyboard is not pressed