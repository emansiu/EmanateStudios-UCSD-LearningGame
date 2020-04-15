//------- INITIALIZE CORE GLOBAL GAME COMPONENTS-------
const canvas = document.getElementById("myCanvas");

let help = () => {
    console.log('help')
}

const globalScale = 1
const characterScale = 1;
const ctx = canvas.getContext("2d");

ctx.canvas.width = 1366 * globalScale;
ctx.canvas.height = 768 * globalScale;

const ballRadius = 60

let xPosition = canvas.width / 2;
let yPosition = canvas.height - ballRadius;

const travelSpeed = {
    x: 2,
    y: -2
}

// ----------- END CORE GLOBAL COMPONENTS---------------





let drawDemon = (scale) => {
    ctx.beginPath();
    ctx.arc(xPosition, yPosition, ballRadius * scale, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}



let draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDemon(characterScale);

    if (xPosition + travelSpeed.x > canvas.width - ballRadius || xPosition + travelSpeed.x < ballRadius) {
        travelSpeed.x = -travelSpeed.x;
    }
    if (yPosition + travelSpeed.y > canvas.height - ballRadius || yPosition + travelSpeed.y < ballRadius) {
        travelSpeed.y = -travelSpeed.y;
    }

    xPosition += travelSpeed.x;
    yPosition += travelSpeed.y;

}

setInterval(draw, 10);