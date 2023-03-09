//
//Mikołaj Gaweł-Kucab
//03-05-2023
//
var WIDTH = 640;
var HEIGHT = 480;
var DIRECTION;
(function (DIRECTION) {
    DIRECTION[DIRECTION["LEFT"] = 0] = "LEFT";
    DIRECTION[DIRECTION["RIGHT"] = 1] = "RIGHT";
    DIRECTION[DIRECTION["UP"] = 2] = "UP";
    DIRECTION[DIRECTION["DOWN"] = 3] = "DOWN";
})(DIRECTION || (DIRECTION = {}));
var Snake = /** @class */ (function () {
    function Snake() {
        this.snakeCells = [];
        this.currentDirection = DIRECTION.LEFT;
        for (var i = 0; i < 4; i++)
            this.snakeCells.push(new SnakeCell((WIDTH) / 2 + SnakeCell.CELL_SIZE * i, (HEIGHT - SnakeCell.CELL_SIZE) / 2));
    }
    Snake.prototype.addNewPart = function () {
        this.snakeCells.push(new SnakeCell(this.snakeCells[this.snakeCells.length - 1].x, this.snakeCells[this.snakeCells.length - 1].y));
    };
    Snake.prototype.update = function () {
        for (var i = 1; i < this.snakeCells.length; i++) {
            this.snakeCells[this.snakeCells.length - i].x = this.snakeCells[this.snakeCells.length - i - 1].x;
            this.snakeCells[this.snakeCells.length - i].y = this.snakeCells[this.snakeCells.length - i - 1].y;
        }
        switch (this.currentDirection) {
            case DIRECTION.LEFT:
                this.snakeCells[0].x -= SnakeCell.CELL_SIZE;
                break;
            case DIRECTION.RIGHT:
                this.snakeCells[0].x += SnakeCell.CELL_SIZE;
                break;
            case DIRECTION.UP:
                this.snakeCells[0].y -= SnakeCell.CELL_SIZE;
                break;
            case DIRECTION.DOWN:
                this.snakeCells[0].y += SnakeCell.CELL_SIZE;
                break;
        }
        if (this.snakeCells[0].x <= -SnakeCell.CELL_SIZE) {
            this.snakeCells[0].x = WIDTH - SnakeCell.CELL_SIZE;
        }
        else if (this.snakeCells[0].x >= WIDTH) {
            this.snakeCells[0].x = 0;
        }
        if (this.snakeCells[0].y <= -SnakeCell.CELL_SIZE) {
            this.snakeCells[0].y = HEIGHT - SnakeCell.CELL_SIZE;
        }
        else if (this.snakeCells[0].y >= HEIGHT) {
            this.snakeCells[0].y = 0;
        }
    };
    Snake.prototype.draw = function (context) {
        context.fillStyle = "green";
        this.snakeCells.forEach(function (element) {
            context.fillRect(element.x, element.y, SnakeCell.CELL_SIZE, SnakeCell.CELL_SIZE);
        });
        context.fillStyle = "#00CC00";
        context.fillRect(this.snakeCells[0].x, this.snakeCells[0].y, SnakeCell.CELL_SIZE, SnakeCell.CELL_SIZE);
    };
    Snake.prototype.alive = function () {
        for (var i = 1; i < this.snakeCells.length; i++) {
            if (this.snakeCells[0].x == this.snakeCells[i].x && this.snakeCells[0].y == this.snakeCells[i].y) {
                return false;
            }
        }
        return true;
    };
    return Snake;
}());
var SnakeCell = /** @class */ (function () {
    function SnakeCell(x, y) {
        this.x = x;
        this.y = y;
    }
    SnakeCell.CELL_SIZE = 32;
    return SnakeCell;
}());
var SnakeFood = /** @class */ (function () {
    function SnakeFood() {
        this.x = 0;
        this.y = 0;
        //wprowadzenie kordynatów za pomocą wielkości części węża i jej możliwej wielkości na planszy
        this.x = (Math.floor(Math.random() * ((WIDTH - SnakeCell.CELL_SIZE) / SnakeCell.CELL_SIZE))) * SnakeCell.CELL_SIZE;
        this.y = (Math.floor(Math.random() * ((HEIGHT - SnakeCell.CELL_SIZE) / SnakeCell.CELL_SIZE))) * SnakeCell.CELL_SIZE;
    }
    SnakeFood.prototype.draw = function (context) {
        context.fillStyle = "red";
        context.fillRect(this.x, this.y, SnakeFood.FOOD_SIZE, SnakeFood.FOOD_SIZE);
    };
    SnakeFood.prototype.checkCollision = function (snakeCell) {
        if (snakeCell.x == this.x && snakeCell.y == this.y) {
            return true;
        }
        return false;
    };
    SnakeFood.FOOD_SIZE = 32;
    return SnakeFood;
}());
var firstLoad = true;
var playing = false;
var score;
var snake;
var snakeFood;
var canvas;
var context;
var stateParagraph;
var scoreParagraph;
function load() {
    snakeFood = new SnakeFood();
    snake = new Snake();
    if (firstLoad) {
        canvas = document.getElementById("game_display");
        scoreParagraph = document.getElementById("game_score");
        stateParagraph = document.getElementById("game_state");
        context = canvas.getContext("2d");
        firstLoad = false;
        context.fillStyle = "black";
        context.fillRect(0, 0, WIDTH, HEIGHT);
        snake.draw(context);
        snakeFood.draw(context);
    }
    else {
        stateParagraph.innerHTML = "<h2>";
        stateParagraph.textContent = "Game Over Press Any Key To Play Again";
        stateParagraph.style.color = "red";
    }
    score = 0;
    playing = false;
}
function input(key) {
    if (!playing) {
        tick(0);
        playing = true;
        return;
    }
    switch (key.key) {
        case "ArrowLeft":
            snake.currentDirection = snake.currentDirection != DIRECTION.RIGHT ? DIRECTION.LEFT : snake.currentDirection;
            break;
        case "ArrowDown":
            snake.currentDirection = snake.currentDirection != DIRECTION.UP ? DIRECTION.DOWN : snake.currentDirection;
            break;
        case "ArrowRight":
            snake.currentDirection = snake.currentDirection != DIRECTION.LEFT ? DIRECTION.RIGHT : snake.currentDirection;
            break;
        case "ArrowUp":
            snake.currentDirection = snake.currentDirection != DIRECTION.DOWN ? DIRECTION.UP : snake.currentDirection;
            break;
    }
    ;
}
function tick(timeStamp) {
    if (!snake.alive()) {
        playing = false;
        load();
        return;
    }
    context.fillStyle = "black";
    context.fillRect(0, 0, WIDTH, HEIGHT);
    snake.update();
    snake.draw(context);
    if (snakeFood.checkCollision(snake.snakeCells[0])) {
        snake.addNewPart();
        snakeFood = new SnakeFood();
        score++;
    }
    snakeFood.draw(context);
    scoreParagraph.textContent = "score: " + score;
    stateParagraph.style.color = "#444444";
    stateParagraph.textContent = "easter egg here";
    setTimeout(tick, 100);
}
window.addEventListener("load", load);
window.addEventListener("keydown", input);
