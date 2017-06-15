(function()
{

	window.requestAnimFrame = (function (callback) {
		return window.requestAnimationFrame || 
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					window.msRequestAnimaitonFrame ||
					function (callback) {
					 	window.setTimeout(callback, 1000/60);
					};
	})();

	var canvas = document.querySelector( "#canvas" );
	canvas.width = 280;
	canvas.height = 280;
	var ctx;
	ctx = canvas.getContext('2d');
	ctx.strokeStyle = "#222222";
	ctx.lineWith = 2;
	ctx.fillStyle="white";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	ctx.color = "black";
	ctx.lineWidth = 8;
    ctx.lineJoin = ctx.lineCap = 'round';
	
	debug();

	var drawing = false;
	var mousePos = { x:0, y:0 };
	var lastPos = mousePos;
	canvas.addEventListener("mousedown", function (e) {
		drawing = true;
		lastPos = getMousePos(canvas, e);
	}, false);
	canvas.addEventListener("mouseup", function (e) {
		drawing = false;
	}, false);
	canvas.addEventListener("mousemove", function (e) {
		mousePos = getMousePos(canvas, e);
	}, false);

	// Set up touch events for mobile, etc
	canvas.addEventListener("touchstart", function (e) {
		mousePos = getTouchPos(canvas, e);
		var touch = e.touches[0];
		var mouseEvent = new MouseEvent("mousedown", {
			clientX: touch.clientX,
			clientY: touch.clientY
		});
		canvas.dispatchEvent(mouseEvent);
	}, false);
	canvas.addEventListener("touchend", function (e) {
		var mouseEvent = new MouseEvent("mouseup", {});
		canvas.dispatchEvent(mouseEvent);
		event.preventDefault();
	}, false);
	canvas.addEventListener("touchmove", function (e) {
		var touch = e.touches[0];
		var mouseEvent = new MouseEvent("mousemove", {
			clientX: touch.clientX,
			clientY: touch.clientY
		});
		canvas.dispatchEvent(mouseEvent);
		event.preventDefault();
	}, false);

	// Get the position of the mouse relative to the canvas
	function getMousePos(canvasDom, mouseEvent) {
		var rect = canvasDom.getBoundingClientRect();
		return {
			x: mouseEvent.clientX - rect.left,
			y: mouseEvent.clientY - rect.top
		};
	}

	// Get the position of a touch relative to the canvas
	function getTouchPos(canvasDom, touchEvent) {
		var rect = canvasDom.getBoundingClientRect();
		return {
			x: touchEvent.touches[0].clientX - rect.left,
			y: touchEvent.touches[0].clientY - rect.top
		};
	}

	// Draw to the canvas
	function renderCanvas() {
		if (drawing) {
			ctx.moveTo(lastPos.x, lastPos.y);
			ctx.lineTo(mousePos.x, mousePos.y);
			ctx.stroke();
			lastPos = mousePos;
		}
	}

	// Allow for animation
	(function drawLoop () {
		requestAnimFrame(drawLoop);
		renderCanvas();
	})();

	function debug()
	{
		/* CLEAR BUTTON */
		var clearButton = $( "#clearButton" );
		
		clearButton.on( "click", function()
		{
			
			canvas.width = canvas.width;
			canvas.width = 280;
			canvas.height = 280;
			ctx = canvas.getContext('2d');
			ctx.strokeStyle = "#222222";
			ctx.lineWith = 2;
			ctx.fillStyle="white";
			ctx.fillRect(0,0,canvas.width,canvas.height);
			ctx.color = "black";
			ctx.lineWidth = 8;
		    ctx.lineJoin = ctx.lineCap = 'round';

		    $("#result").html("");
			
		});

		/* COLOR SELECTOR */

		$( "#colors" ).change(function()
		{
			var color = $( "#colors" ).val();
			ctx.color = color;
		});
		
		/* LINE WIDTH */
		
		$( "#lineWidth" ).change(function()
		{
			ctx.lineWidth = $( this ).val();
		});
	}
}());