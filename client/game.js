

const canvas = document.getElementById('game')

const globalScale = 1;

const levels = 6;
const numberOfRounds = 30;

const square = canvas.getContext("2d");
square.beginPath();
square.rect(20, 20, 50, 50);
square.fillStyle = "#FF0000";
square.fill();
square.closePath();

let demonAttributes = {
    eyeDiameter: [15, 30], //<-- 15px goes left, 30px goes right
    eyeColor: ['yellow', 'blue'],
    eyeShade: [1, 2, 3, 4, 5],
    color: ['red', 'gray'],
    hornHeightMin: 15,
    hornHeightMax: 60,
    hornWidthMin: 5,
    hornWidthMax: 20,
    bodyHeight: 20,
    bodyWidth: 20
}

gsap.to("#game", { delay: 1, duration: 2, x: 300, y: -400 });

console.log(demonAttributes.eyeColor)