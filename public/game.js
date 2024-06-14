const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.style.background = 'indigo';

canvas.width = 600;
canvas.height = 600;

const socket = io();

class Player
{
    constructor(xpos, ypos, width, height, color, speed)
    {
        this.xpos = xpos;
        this.ypos = ypos;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed;
        this.dy = 0;
    }

    draw(context)
    {
        context.beginPath();
        context.fillStyle = this.color;
        context.fillRect(this.xpos, this.ypos, this.width, this.height);
        context.closePath();
    }

    update(player, ball)
    {
        if(player == 4)
        {
            if(ball.dx > 0)
            {
                this.dy = 0;
            }
            else
            {
                if(this.ypos + this.height / 2 < ball.ypos)
            {
                this.dy = this.speed;
            }
            else if(this.ypos + this.height / 2 > ball.ypos)
            {
                this.dy = -this.speed;
            }
            else
            {
                this.dy = 0;
            }
            }
            
        }

        
        this.ypos += this.dy;
        if(this.ypos <= 0)
        {
            this.ypos = 0;
        }
        else if(this.ypos + this.height > canvas.height)
        {
            this.ypos = canvas.height - this.height;
        }
        
        this.draw(ctx);
    }
}

class Ball{
    constructor(xpos, ypos, radius, color, speed)
    {
        this.xpos = xpos;
        this.ypos = ypos;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.dy = speed;
        this.dx = speed;
    }

    draw(context)
    {
        context.beginPath();
        context.arc(this.xpos, this.ypos, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }

    update(player1, player2) {
        this.xpos += this.dx;
        this.ypos += this.dy;

        if (this.xpos + this.radius > canvas.width || this.xpos - this.radius < 0) {
            this.ypos = window.innerHeight / 2;
            this.xpos = window.innerWidth / 2;
            this.dx = this.speed;
            this.dy = this.speed;
        }

        if (this.ypos + this.radius > canvas.height || this.ypos - this.radius < 0) {
            this.dy = -this.dy;
        }

        if (this.checkCollision(player1) || this.checkCollision(player2)) {
            this.dx = -this.dx;
            this.speed = Math.random() * this.speed + 6; 
            socket.emit('ball speed', this.speed);
        }
        this.draw(ctx);
    }
    checkCollision(player) {
        let nearestX = Math.max(player.xpos, Math.min(this.xpos, player.xpos + player.width));
        let nearestY = Math.max(player.ypos, Math.min(this.ypos, player.ypos + player.height));

        let deltaX = this.xpos - nearestX;
        let deltaY = this.ypos - nearestY;
        let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        return distance < this.radius;
    }
}

const players = {
    1: new Player(0, canvas.height / 2 -50, 25, 100, 'red', 2),
    2: new Player(canvas.width - 25, canvas.height / 2 - 50, 25, 100,'blue', 2),
    3: new Player(canvas.width - 25, canvas.height / 2 - 50, 25, 100,'blue', 2),
    4: new Player(0, canvas.height / 2 -50, 25, 100, 'red', 2),
}

const playerNum = sessionStorage.getItem('player');
const player = players[playerNum];
const ball = new Ball(canvas.width / 2, canvas.height / 2, 20, 'green', 1);
if(playerNum == 1 || playerNum == 2)
{
    function animate()
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ball.update(players[1], players[2]);
        players[1].update(1, ball);
        players[2].update(2, ball);
        socket.emit('move player', {playerNum: playerNum, xpos: player.xpos, ypos: player.ypos, ballXpos: ball.xpos, ballYpos: ball.ypos, ballDX: ball.dx, ballDY: ball.dy});
        requestAnimationFrame(animate);
    }

    function keyDownHandler(event)
    {
            if(event.key === 'ArrowUp')
        {
            player.dy = -player.speed;
        }
        else if(event.key === 'ArrowDown')
        {
            player.dy = player.speed;
        }
    }

    function keyUpHandler(event)
    {
        if(event.key === 'ArrowUp' || event.key === 'ArrowDown')
        {
            player.dy = 0;
        }
    }

    socket.on('update screen', (data) => {
        players[data.playerNum].xpos = data.xpos;
        players[data.playerNum].ypos = data.ypos;
        ball.xpos = data.ballXpos;
        ball.ypos = data.ballYpos;
        ball.dx = data.ballDX;
        ball.dy = data.ballDY;
    });

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    animate();
}
else if(playerNum == 3)
{
    var player4 = players[4];
    function animate()
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ball.update(players[3], players[4]);
        players[3].update(3, ball);
        players[4].update(4, ball);
        socket.emit('move player', {playerNum: playerNum, xpos: player.xpos, ypos: player.ypos, ballXpos: ball.xpos, ballYpos: ball.ypos, ballDX: ball.dx, ballDY: ball.dy});
        requestAnimationFrame(animate);
    }

    function keyDownHandler(event)
    {
            if(event.key === 'ArrowUp')
        {
            player.dy = -player.speed;
        }
        else if(event.key === 'ArrowDown')
        {
            player.dy = player.speed;
        }
    }

    function keyUpHandler(event)
    {
        if(event.key === 'ArrowUp' || event.key === 'ArrowDown')
        {
            player.dy = 0;
        }
    }

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    animate();
    
}



