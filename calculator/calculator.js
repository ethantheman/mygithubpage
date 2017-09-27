window.onload = function(){

	var zero = document.createElement("zero");
	var one = document.createElement("one");
	var two = document.createElement("two");
	var three = document.createElement("three");
	var four = document.createElement("four");
	var five = document.createElement("five");
	var six = document.createElement("six");
	var seven = document.createElement("seven");
	var eight = document.createElement("eight");
	var nine = document.createElement("nine");
	var plus = document.createElement("plus");
	var minus = document.createElement("minus");
	var multiply = document.createElement("multiply");
	var divide = document.createElement("divide");
	var openPar = document.createElement("openPar");
	var closePar = document.createElement("closePar");
	var dot = document.createElement("dot");
	var clear = document.createElement("clear");
	var exp = document.createElement("exp");
	var equals = document.createElement("equals");
	var screen = document.getElementById("screen");

	var symbols = ['AC', '(', ')', '^', '+', '7', '8', '9', '-', '4', '5', '6', '*', '1', '2', '3', '/', '.', '0', '='];

	var buttons = [clear, openPar, closePar, exp, plus, seven, eight, nine, minus, four, five, six, multiply, one, two, three, divide, dot, zero, equals]

	var count = 0;

	// draw the buttons in order:

	function drawButton(a){
		if(count <= 4){
			if(symbols[count] === 'AC'){
				a.setAttribute("id", 'AC');
			}else{
				a.setAttribute("id", "tile");
			}
			a.innerHTML = symbols[count];
			document.getElementById("row1").append(a);
		}
		if(count > 4 && count <= 8){
			a.setAttribute("id", "tile");
			a.innerHTML = symbols[count];
			document.getElementById("row2").append(a);
		}
		if(count > 8 && count <= 12){
			a.setAttribute("id", "tile");
			a.innerHTML = symbols[count];
			document.getElementById("row3").append(a);
		}
		if(count > 12 && count <= 16){
			a.setAttribute("id", "tile");
			a.innerHTML = symbols[count];
			document.getElementById("row4").append(a);
		}
		if(count > 16){
			if(symbols[count] === '='){
				a.setAttribute("id", 'equals');
			}else{
				a.setAttribute("id", "tile");
			}
			a.innerHTML = symbols[count];
			document.getElementById("row5").append(a);
		}
		count += 1
	}

	function clickListen(button){
		button.addEventListener("click", function(){
			// on click, calculate will add innerhtml to the queue of operations or operands.
			calculate(button);
		});
	}

	e = "";

	function isValidExpression(exp){
		try{
			eval(exp);
		} catch (e) {
			if(e instanceof SyntaxError) {
				return false;
			}
		}
		return true;
	}

	function calculate(button){
		if(button.innerHTML === '='){
			if(isValidExpression(e)){
				console.log(eval(e)); // evaluates the expression stored in e.
				screen.innerHTML = eval(e);
			}
			else{
				console.log("syntax error");
				screen.innerHTML = "ERROR"
			}
		}
		else if(button.innerHTML === 'AC'){
			console.log('CLEAR ALL');
			e = "";
			screen.innerHTML = e;
		}
		else{
			if(button.innerHTML === '^'){
				e += '**';
				console.log(e);
				screen.innerHTML = e;
			}
			else{
				e += button.innerHTML;
				console.log(e);
				screen.innerHTML = e;
			}
		}
	}

	// draw buttons and add event listeners:
	for(var i = 0; i < symbols.length; i++){
		drawButton(buttons[i]);
		clickListen(buttons[i]);
	}


}