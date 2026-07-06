//setup canvas tool and brush
var c = document.getElementById("PomodoroCanvas");
var ctx = c.getContext("2d");

//set canvas size to match the window size
const size = window.devicePixelRatio;
c.width = c.clientWidth * size;
c.height = c.clientHeight * size;

//define colors for the branches and leaves
const brown = [101, 67, 33];
const green = [38, 116, 48];

//draw the branches recursively
function drawBranches(startX, startY, length, angle, depth, maxDepth) {
    if (depth <= 0) {
        return;
    }

    // Calculate the end point of the branch
    const endBranchX = startX + length * Math.cos(angle);
    const endBranchY = startY + length * Math.sin(angle);
    const factor = 1-(depth/maxDepth);

    // Draw the branch
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endBranchX, endBranchY);
    ctx.lineWidth = depth * 1.5;
    ctx.strokeStyle = getInterpolatedColor(brown, green, factor);
    ctx.stroke();

    // Calculate the angles for the left and right branches
    const minangle = 10 * (Math.PI / 180);
    const maxangle = 30 * (Math.PI / 180);

    // Recursively draw the left and right branches
    const leftangle = angle - getRandomAngle(minangle, maxangle);
    const rightangle = angle + getRandomAngle(minangle, maxangle);
    drawBranches(endBranchX, endBranchY, length * 0.7, leftangle, depth - 1, maxDepth);
    drawBranches(endBranchX, endBranchY, length * 0.7, rightangle, depth - 1, maxDepth);
}

// Interpolate between two colors based on a factor (0 to 1)
function getInterpolatedColor(color1, color2, factor) {
    const r = Math.round(color1[0] + (color2[0] - color1[0]) * factor);
    const g = Math.round(color1[1] + (color2[1] - color1[1]) * factor);
    const b = Math.round(color1[2] + (color2[2] - color1[2]) * factor);
    return `rgb(${r}, ${g}, ${b})`;
}

// Generate a random angle between min and max
function getRandomAngle(min, max) {
    return Math.random() * (max - min) + min;
}

// Draw the sky as a gradient background
const gradient = ctx.createLinearGradient(0, 0, c.width, c.height);
gradient.addColorStop(0, "#0e3e97");
gradient.addColorStop(0.5, "#90ade4");
gradient.addColorStop(1, "#1e2ebd");

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, c.width, c.height*0.8);

// draw the ground as a solid color
ctx.fillStyle = "#267430";
ctx.fillRect(0, c.height*0.8, c.width, c.height*0.2);

// Redraws the branches when the window is resized
window.addEventListener("resize", function () {
    c.width = c.clientWidth * size;
    c.height = c.clientHeight * size;
    drawBranches(c.width / 2, c.height, 100, -Math.PI / 2, 9, 9);
});