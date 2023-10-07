/* ----- DOM SELECTORS ------ */
const movement = document.querySelector("#movement");
const status = document.querySelector("#status");
const canvas = document.querySelector("canvas");

/* ----- CANVAS SETUP ------- */
const ctx = canvas.getContext("2d");
console.log(ctx);
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
const testPlayer = new Player(45, 45, 65, 23, "green");
testPlayer.render();
const skier = new Player(100, 50, 30, 70, "#217224");



/* ----- FUNCTIONS ---------- */


/* ----- EVENT LISTENERS ---- */