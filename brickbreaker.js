/* 
coordinate notes:

canvas.width points to the right side of the canvas
0 points to the left side of the canvas

paddleX points to the leftmost piece of the paddle
and the paddle is 75 pixels wide

canvas.height points to the bottom of the canvas
0 points to the top of the canvas

*/

/*  // TO DO:
	1a. on game over, reset all bricks!
	1. define action when user wins game:
		a. add button to reset game (or move on to next level?)
		b. store high score (time?)
	2. give the ball spin depending on motion of the paddle like slicing a tennis ball
	3. add extra rows of bricks, make certain bricks harder to break (require more hits, change color on hits)
*/

var canvas = document.getElementById("myCanvas");
var scoreboard = document.getElementById("scoreboard");
var ctx = canvas.getContext("2d"); // this is the tool we use to paint on the canvas
var win = false;

///// BALL STUFF
// starting position and size of ball:
var x = canvas.width / 2;
var y = canvas.height - 30;
var ballRadius = 5;

// how much ball will move each time it is repainted:
var dx = 2;
var dy = -2;

///// PADDLE STUFF
// STARTING POSITION AND SIZE OF PADDLE:
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;

////// right and left keys:
var right_key = false;
var left_key = false;

//////// SCOREBOARD STUFF:
var lives = 3;

///// BRICKS:
var brickhash = {};
for(var h = 0; h < 10; h++){
	brickhash[h] = 1;
}

numBricks = Object.keys(brickhash).length;

function drawBricks(){
	zero_count = 0;
	for(var i = 0; i < numBricks; i++){
		if(brickhash[i] !== 0){
				ctx.beginPath();
				ctx.strokeStyle = "#B69011";
				ctx.rect(i * canvas.width/numBricks, 0, canvas.width / numBricks, paddleHeight);
				ctx.stroke();
				ctx.closePath();
		}else{
			zero_count += 1;
		}
	}
	if(zero_count === 10){
		win = true;
	}
}

function drawBall(){
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2, false);
	ctx.fillStyle = "#6CACD1";
	ctx.fill();
	ctx.closePath();
}

function drawPaddle(){
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "#B69011";
	ctx.fill();
	ctx.closePath();
}

// MAIN FUNCTION:
function draw(){

	// display score:
	scoreboard.innerHTML = "lives remaining: " + lives;

	ctx.clearRect(0, 0, canvas.width, canvas.height); // CLEAR PREVIOUS DRAWING

	// move paddle:
	if(right_key){
		if(paddleX < canvas.width - paddleWidth){
			paddleX += 5;
		}
	}
	else if(left_key){
		if(paddleX > 0){
			paddleX -= 5;			
		}
	}

	// detection for bouncing off walls, bricks and paddle:
	if(hitSide(x, dx)){
		dx = -dx;
	}

	if(hitTop(y, dy)){
		dy = -dy;
	}

	if(hitBrick(y, dy)){
		dy = -dy;
	}

	if(hitPaddle(x, dx, y, dy)){
		dy = -dy
	}

	if(hitBottom(y, dy)){
		dy = 0;
		dx = 0;

		if(lives < 1){
			// if no lives left, button resets game.
			var button = document.createElement("button");
			button.setAttribute("id", "button");
			button.innerHTML = "Game over. Play again?";
			document.getElementById("body").appendChild(button);
			button.addEventListener ("click", function() {
				// reset lives, ball and paddle to starting position.
				lives = 3;
				x = canvas.width/2;
				y = canvas.height-30;
			 	dx = 2;
			 	dy = -2;
			 	paddleX = (canvas.width-paddleWidth)/2;
			 	document.getElementById('button').parentNode.removeChild(document.getElementById('button'));
			});
		}

		else{
			// if more lives left, add button to go again.
			lives -= 1;
			var button = document.createElement("button");
			button.setAttribute("id", "button");
			button.innerHTML = "Go again!";
			document.getElementById("body").appendChild(button);
			button.addEventListener ("click", function() {
				// deduct 1 life, reset ball and paddle to starting position.
				x = canvas.width/2;
				y = canvas.height-30;
			 	dx = 2;
			 	dy = -2;
			 	paddleX = (canvas.width-paddleWidth)/2;
			 	document.getElementById('button').parentNode.removeChild(document.getElementById('button'));
			});

		}
	}

	x += dx;
	y += dy;

	// DRAW NEW ELEMENTS
	drawBricks();
	drawPaddle();
	drawBall();
}

function hitSide(x, dx){
	return (x + dx > canvas.width - ballRadius || x + dx < ballRadius);
}

function hitTop(y, dy){
	return (y + dy < ballRadius);
}

function hitBottom(y, dy){
	return (y + dy > canvas.height - ballRadius);
}

function hitPaddle(x, dx, y, dy){
	// if in the L-R span of the paddle:
	if(x + dx >= paddleX && x + dx <= paddleX + paddleWidth){
		// if edge of ball contacts edge of paddle
		if(y + dy + ballRadius > canvas.height - paddleHeight){
			return true;
		}
	}
	return false;
}

function brickAt(x, dx){
	// need to relate the x position of the ball to the brick in brickhash at that position.
	// bricks are arranged evenly as a proportion of canvas.width. each is canvas.width / numBricks px wide
	//  
	brick = Math.floor((x + dx) / (canvas.width / numBricks)); // gives the index of the brick at x.
	if(brickhash[brick] === 1){
		brickhash[brick] = 0;
		return true;
	}
	return false;
}

function hitBrick(){
	// change value of brick to 0
	// reverse dy

	if(y + dy < paddleHeight + ballRadius){
		// helper function brickAt returns true if there is a brick at the x coordinate of the ball
		if(brickAt(x, dx)){
			// return true. in the draw function, if this returns true, delete the brick at that area (that's the hard part...)
			return true;
		}
	}
	return false;
}

function keyDownHandler(e){
	// set vars to true
	if(e.keyCode == 39){ // right arrow
		right_key = true;
	}
	else if(e.keyCode == 37){ // left arrow
		left_key = true;
	}
}

function keyUpHandler(e){
	// set vars to false
	if(e.keyCode == 39){ // right arrow
		right_key = false;
	}
	else if(e.keyCode == 37){ // left arrow
		left_key = false;
	}
}


document.addEventListener("keydown", keyDownHandler, false); // fires whenever a key is depressed
document.addEventListener("keyup", keyUpHandler, false); // fires whenever a key is released
setInterval(draw, 10); // draw will be called every 10 ms until we stop it