//
//Mikołaj Gaweł-Kucab
//03-05-2023
//
const WIDTH=640;
const HEIGHT=480;

enum DIRECTION
{
    LEFT,
    RIGHT,
    UP,
    DOWN
}
class Snake
{
    currentDirection:DIRECTION;
	snakeCells:Array<SnakeCell> = [];
    constructor()
    {
        this.currentDirection = DIRECTION.LEFT;
        for(let i:number = 0;i < 4;i++)
            this.snakeCells.push(new SnakeCell((WIDTH)/2 + SnakeCell.CELL_SIZE*i
            ,(HEIGHT-SnakeCell.CELL_SIZE)/2));
        
    }
    addNewPart()
    {
        this.snakeCells.push(new SnakeCell(this.snakeCells[this.snakeCells.length-1].x,this.snakeCells[this.snakeCells.length-1].y));
    }
    update()
    {
        for(let i:number = 1;i < this.snakeCells.length;i++)
        {
            this.snakeCells[this.snakeCells.length-i].x = this.snakeCells[this.snakeCells.length-i-1].x;
            this.snakeCells[this.snakeCells.length-i].y = this.snakeCells[this.snakeCells.length-i-1].y
        }
        switch(this.currentDirection)
        {
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
        if(this.snakeCells[0].x <= -SnakeCell.CELL_SIZE)
        {
            this.snakeCells[0].x = WIDTH - SnakeCell.CELL_SIZE;
        }
        else if(this.snakeCells[0].x >= WIDTH)
        {
            this.snakeCells[0].x = 0;
        }

        if(this.snakeCells[0].y <= -SnakeCell.CELL_SIZE)
        {
            this.snakeCells[0].y = HEIGHT - SnakeCell.CELL_SIZE;
        }
        else if(this.snakeCells[0].y >= HEIGHT)
        {
            this.snakeCells[0].y = 0;
        }
    }
    draw(context:CanvasRenderingContext2D)
    {
        context.fillStyle = "green";
        this.snakeCells.forEach(element => {
            context.fillRect(element.x,element.y,SnakeCell.CELL_SIZE,SnakeCell.CELL_SIZE);    
        });
        context.fillStyle = "#00CC00";
        context.fillRect(this.snakeCells[0].x,this.snakeCells[0].y,SnakeCell.CELL_SIZE,SnakeCell.CELL_SIZE);
    }
    alive(): boolean
    {
        for(let i:number = 1;i < this.snakeCells.length;i++)
        {
            if(this.snakeCells[0].x == this.snakeCells[i].x && this.snakeCells[0].y == this.snakeCells[i].y )
            {
                return false;
            }
        }
        return true;
    }
}
class SnakeCell
{
    static CELL_SIZE = 32;
	x:number;
    y:number;
	constructor(x:number,y:number)
	{
        this.x = x;
        this.y = y;        
	}
}
class SnakeFood
{
    static FOOD_SIZE = 32;
	x:number = 0;
    y:number = 0;
	constructor()
	{
        //wprowadzenie kordynatów za pomocą wielkości części węża i jej możliwej wielkości na planszy
        this.x = (Math.floor(Math.random() * ((WIDTH-SnakeCell.CELL_SIZE)/SnakeCell.CELL_SIZE)))*SnakeCell.CELL_SIZE;
        this.y = (Math.floor(Math.random() * ((HEIGHT-SnakeCell.CELL_SIZE)/SnakeCell.CELL_SIZE)))*SnakeCell.CELL_SIZE;        
	}
    draw(context:CanvasRenderingContext2D)
    {
        context.fillStyle = "red";
        context.fillRect(this.x,this.y,SnakeFood.FOOD_SIZE,SnakeFood.FOOD_SIZE);
    }
    checkCollision( snakeCell: SnakeCell ): boolean
    {
        if(snakeCell.x == this.x && snakeCell.y == this.y)
        {
            return true;
        }
        return false;
    }
}
let firstLoad:boolean = true;
let playing:boolean = false;
let score:number;

let snake:Snake;
let snakeFood:SnakeFood;
let canvas:HTMLCanvasElement;
let context:CanvasRenderingContext2D;
let stateParagraph:HTMLParagraphElement;
let scoreParagraph:HTMLParagraphElement;
function load()
{
    snakeFood = new SnakeFood();
    snake = new Snake();
    if(firstLoad)
    {
        canvas = document.getElementById("game_display") as HTMLCanvasElement;
        scoreParagraph = document.getElementById("game_score") as HTMLParagraphElement;
        stateParagraph = document.getElementById("game_state") as HTMLParagraphElement;
        context = canvas.getContext("2d") as CanvasRenderingContext2D;
        firstLoad = false;

        context.fillStyle = "black";
	    context.fillRect(0, 0, WIDTH, HEIGHT);
        snake.draw(context);
        snakeFood.draw(context);
       
    }else{
        stateParagraph.innerHTML = "<h2>";
        stateParagraph.textContent = "Game Over Press Any Key To Play Again";
        stateParagraph.style.color = "red";
    }
    score = 0;
    
    playing = false;
}

function input(key:KeyboardEvent)
{
    if(!playing)
    {
        tick(0);
        playing = true;
        return;
    }
    switch(key.key)
    {
        case "ArrowLeft":
            snake.currentDirection =snake.currentDirection != DIRECTION.RIGHT? DIRECTION.LEFT : snake.currentDirection;
            break;
        case "ArrowDown":
            snake.currentDirection =snake.currentDirection != DIRECTION.UP? DIRECTION.DOWN : snake.currentDirection;
            break;
        case "ArrowRight":
            snake.currentDirection =snake.currentDirection != DIRECTION.LEFT? DIRECTION.RIGHT : snake.currentDirection;
            break;
        case "ArrowUp":
            snake.currentDirection =snake.currentDirection != DIRECTION.DOWN? DIRECTION.UP : snake.currentDirection;
            break;
    };
}
function tick(timeStamp:number)
{
    if(!snake.alive())
    {
        playing = false;
        load();
        return;
    }
    context.fillStyle = "black";
	context.fillRect(0, 0, WIDTH, HEIGHT);

    snake.update();
    snake.draw(context);
  
    if(snakeFood.checkCollision(snake.snakeCells[0]))
    {
        snake.addNewPart();
        snakeFood = new SnakeFood();
        score++;
    }
    snakeFood.draw(context);
    scoreParagraph.textContent = "score: " + score; 
    
    stateParagraph.style.color = "#444444";
    stateParagraph.textContent = "easter egg here";
    setTimeout(tick,100);
}
window.addEventListener("load",load);
window.addEventListener("keydown",input);
