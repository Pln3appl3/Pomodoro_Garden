//setup canvas tool and brush
var c = document.getElementById("PomodoroCanvas");
var ctx = c.getContext("2d");

//sets the canvas resolution of the canvas to the size of the canvas element
c.width = c.clientWidth;
c.height = c.clientHeight;

//draw line
ctx.moveTo(40, 40);
ctx.lineTo(40, 200);
ctx.stroke();

function drawBranches(startx, startY, length) {
    const angle = getRandomAngle(-45, 45);
}

function getRandomAngle(min, max) {
    return Math.random() * (max-min) + min;
}