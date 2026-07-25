//setup canvas tool and brush
var c = document.getElementById("PomodoroCanvas");
var ctx = c.getContext("2d");


let hiddenAt = null;
let wiltAmount = 0;

//set canvas size to match the window size
function setupCanvasSize() {
    const size = window.devicePixelRatio;
    c.width = c.clientWidth * size;
    c.height = c.clientHeight * size;
    ctx.scale(size, size);
}

//define colors for the branches and leaves
const wiltedColor = [90, 75, 60];
const brown = [101, 67, 33];
const green = [38, 116, 48];

function drawStem(x, groundY, flowerY) {
    ctx.beginPath();
    ctx.moveTo(x, groundY);
    ctx.lineTo(x, flowerY);
    ctx.strokeStyle = "#1a500a";
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawLeaf(x,y,angle){
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0,0,6,2.5,0,0,2*Math.PI);
    ctx.fillStyle = "#3fa34d";
    ctx.fill();
    ctx.restore();
}

function buildFlowers(count) {
    const flowers = [];
    const trunkExclusionRadius = 60;
    let placed = 0;

    while (placed < count) {
        const x = Math.random() * c.clientWidth;
        const distanceFromCenter = Math.abs(x - c.clientWidth / 2);
        if (distanceFromCenter < trunkExclusionRadius) continue;
        
        flowers.push({x: x, y: c.clientHeight * 0.8 - 5});
        placed++;
    }
    return flowers;
}

function drawFlower(x, y) {
    const groundY = c.clientHeight * 0.8;
    const stemHeight = 15;
    const flowerY = y - stemHeight;

    drawStem(x, groundY, flowerY);
    drawLeaf(x, flowerY + 6, -0.6);
    drawLeaf(x, flowerY + 6, 0.6);

    const petalColor = "pink";
    const centerColor = "yellow";
    const petalOffest = [[0,-5], [5,0], [0,5], [-5,0]];    

    for (const [dx, dy] of petalOffest) {
        ctx.beginPath();
        ctx.arc(x + dx, flowerY + dy, 3, 0, 2 * Math.PI);
        ctx.fillStyle = petalColor;
        ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(x, flowerY, 3, 0, 2 * Math.PI);
    ctx.fillStyle = centerColor;
    ctx.fill();
}

function drawFlowers(flowers, growthProgress) {
    if (growthProgress <= 0.5) return;
    const bloomamount = (growthProgress - 0.5) / 0.5;
    const bloomedCount = Math.floor(bloomamount * flowers.length);

    for (let i = 0; i < bloomedCount; i++) {
        drawFlower(flowers[i].x, flowers[i].y);
    }
}

function buildGrass(bladeCount) {
    const blades = [];
    for (let i = 0; i < bladeCount; i++) {
        blades.push({
            x: Math.random() * c.clientWidth,
            offset: Math.random() * 100
        });
    }
    return blades;
}


function drawGrass(x, y, height, timeOffset) {
    const swayAmount = Math.sin(Date.now() / 300 + timeOffset) * 2;
    const tipx = x + swayAmount;
    const tipy = y - height;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + swayAmount / 2, y - height / 2, tipx, tipy);
    ctx.strokeStyle = "#1a500a";
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawAllGrass(blades) {
    const groundY = c.clientHeight * 0.8;
    for (const blade of blades) {
        drawGrass(blade.x, groundY, 15, blade.offset);
    }
}
// prebuild a tree to store and rebuild from over time
function buildTree(angle, currentDepth, maxDepth) {
    if (currentDepth <= 0) return null;

    const minAngle = 10 * (Math.PI / 180);
    const maxAngle = 30 * (Math.PI / 180);
    const leftAngle = angle - getRandomAngle(minAngle, maxAngle);
    const rightAngle = angle + getRandomAngle(minAngle, maxAngle);

    return {
        angle: angle,
        left: buildTree(leftAngle, currentDepth - 1, maxDepth),
        right: buildTree(rightAngle, currentDepth - 1, maxDepth)
    };
}

//draw the branches recursively
function drawBranches(node, startX, startY, length, currentDepth, maxDepth, unlockedDepth, partialGrowth, wiltAmount) {
    if (!node || currentDepth < maxDepth - unlockedDepth) return;

    let drawLength = length;
    if (currentDepth === maxDepth - unlockedDepth) {
        drawLength = length * partialGrowth;
    }

    const outerness = 1 - (currentDepth / maxDepth);
    const droopedAngle = node.angle + (wiltAmount * outerness * 0.8);

    // Calculate the end point of the branch
    const endBranchX = startX + drawLength * Math.cos(droopedAngle);
    const endBranchY = startY + drawLength * Math.sin(droopedAngle);
    const Healthyfactor = 1-(currentDepth/maxDepth);

    // Draw the branch
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endBranchX, endBranchY);
    ctx.lineWidth = currentDepth * 4;
    ctx.strokeStyle = getWiltedColor(Healthyfactor, wiltAmount);
    ctx.stroke();

    drawBranches(node.left, endBranchX, endBranchY, length * 0.7, currentDepth - 1, maxDepth, unlockedDepth, partialGrowth, wiltAmount);
    drawBranches(node.right, endBranchX, endBranchY, length * 0.7, currentDepth - 1, maxDepth, unlockedDepth, partialGrowth, wiltAmount);
}

// Interpolate between two colors based on a factor (0 to 1)
function getInterpolatedColor(color1, color2, factor) {
    const r = Math.round(color1[0] + (color2[0] - color1[0]) * factor);
    const g = Math.round(color1[1] + (color2[1] - color1[1]) * factor);
    const b = Math.round(color1[2] + (color2[2] - color1[2]) * factor);
    return `rgb(${r}, ${g}, ${b})`;
}

function getInterpolatedColorRGB(color1, color2, factor) {
    const r = Math.round(color1[0] + (color2[0] - color1[0]) * factor);
    const g = Math.round(color1[1] + (color2[1] - color1[1]) * factor);
    const b = Math.round(color1[2] + (color2[2] - color1[2]) * factor);
    return [r, g, b];
}

function getWiltedColor(Healthyfactor, wiltAmount) {
    const baseColor = getInterpolatedColorRGB(brown, green, Healthyfactor);
    return getInterpolatedColor(baseColor, wiltedColor, wiltAmount);

}

// Generate a random angle between min and max
function getRandomAngle(min, max) {
    return Math.random() * (max - min) + min;
}

function drawSky(){
    const gradient = ctx.createLinearGradient(0, 0, c.clientWidth, c.clientHeight);
    
    if (currentWeather && currentWeather.isNight) {
        gradient.addColorStop(0, "#0b0c2a");
        gradient.addColorStop(0.5, "#1d1d4e");
        gradient.addColorStop(1, "#0b0c2a");
    } else {
        gradient.addColorStop(0, "#0e3e97");
        gradient.addColorStop(0.5, "#90ade4");
        gradient.addColorStop(1, "#1e2ebd");
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, c.clientWidth, c.clientHeight * 0.8);
}

function buildRainDrops(count) {
    const drops = [];
    for (let i = 0; i < count; i++) {
        drops.push({
            x: Math.random() * c.clientWidth,
            y: Math.random() * c.clientHeight * 0.8,
            speed: Math.random() * 2 + 2
        })
    }
    return drops;
}

function drawRain(drops) {
    ctx.strokeStyle = "rgba(174,194,224,0.5)";
    ctx.lineWidth = 1;

    for (const drop of drops) {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + 10);
        ctx.stroke();

        drop.y += drop.speed;

        if (drop.y > c.clientHeight * 0.8) {
            drop.y = 0;
            drop.x = Math.random() * c.clientWidth;
        }
    }
}

function render() {
    ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
    // Draw the sky as a gradient background
    drawSky();

    // draw the ground as a solid color
    ctx.fillStyle = "#267430";
    ctx.fillRect(0, c.clientHeight * 0.8, c.clientWidth, c.clientHeight * 0.2);

    const totalSeconds = 25 * 60; // Assuming a 25-minute Pomodoro timer
    const maxDepth = 9;
    const growthProgress = 1-(secondsRemaining / totalSeconds);
    const scaledProgress = growthProgress * maxDepth;
    const unlockedDepth = Math.floor(scaledProgress);
    const partialGrowth = scaledProgress - unlockedDepth;

    if (currentWeather && currentWeather.condition === "Rain") {
        drawRain(rainDrops);
    }

    if (wiltAmount > 0) {
        wiltAmount -= 0.001;
        if (wiltAmount < 0) {
            wiltAmount = 0;
        }
    }

    drawFlowers(flowers, growthProgress);
    drawAllGrass(grassBlades);
    drawBranches(treeShape, c.clientWidth / 2, 5 * c.clientHeight / 6, 200, 9, 9, unlockedDepth, partialGrowth, wiltAmount);
    requestAnimationFrame(render);
}

const rainDrops = buildRainDrops(150);
const treeShape = buildTree(-Math.PI / 2, 9, 9);
const grassBlades = buildGrass(50);
const flowers = buildFlowers(15);
setupCanvasSize();
render();

document.addEventListener("visibilitychange", () => {
    if (currentState !== states.GROWING) return;

    if (document.hidden) {
        hiddenAt = Date.now();
    } else {
        if (hiddenAt !== null) {
            const hiddenDuration = Date.now() - hiddenAt;
            const wiltThreshold = 15000; // Example threshold of 15 seconds
            wiltAmount = Math.min(hiddenDuration / wiltThreshold, 1);
            hiddenAt = null;
        }
    }
});

// Redraws the branches when the window is resized
window.addEventListener("resize", function () {
    setupCanvasSize();
});