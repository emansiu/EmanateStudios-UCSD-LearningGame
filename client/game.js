//------- INITIALIZE CORE GLOBAL GAME COMPONENTS-------
const playArea = document.getElementById("playArea");

let windowHeight = window.innerHeight;
let windowWidth = window.innerWidth;

playArea.setAttribute("height", `${'100%'}`);
playArea.setAttribute("width", `${'100%'}`);

let score = 0

// ----------- END CORE GLOBAL COMPONENTS---------------



//=========================== Animation section ========================================
const characterFadeOut = (characterToFade) => {
    gsap.to(characterToFade, { duration: 0.5, scale: 1.2, opacity: 0, transformOrigin: "center center" });
}
const gameAnimation = (characterToAnimate) => {
    gsap.timeline()
        .to(characterToAnimate, { duration: 4, y: -20 })
        .to(characterToAnimate, { duration: 4, x: 30 }, "+=2")
}



const createCharacter = (() => {

    // create g tag (group that holds all pieces of character)
    let characterGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    characterGroup.setAttribute("id", "character");

    // ------ create body ------------
    let body = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    body.setAttribute("width", "10");
    body.setAttribute("height", "10");
    body.setAttribute("x", "37.5");
    body.setAttribute("y", "45");
    body.setAttribute("fill", "blue");
    // ------ create left eye ------------
    let leftEye = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    leftEye.setAttribute("cx", "40");
    leftEye.setAttribute("cy", "49");
    leftEye.setAttribute("r", "2");
    leftEye.setAttribute("fill", "red");
    // ------ create right eye ------------
    let rightEye = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    rightEye.setAttribute("cx", "45");
    rightEye.setAttribute("cy", "49");
    rightEye.setAttribute("r", "2");
    rightEye.setAttribute("fill", "red");

    // ------ create left horn ------------

    // ------ create right horn ------------

    // attach it to the container group (characterGroup)
    characterGroup.appendChild(body);
    characterGroup.appendChild(leftEye);
    characterGroup.appendChild(rightEye);
    // attach to static svg on page
    document.getElementById("playArea").appendChild(characterGroup);

    // make character clickable only once per round
    console.log(characterGroup);
    const once = () => {
        characterGroup.removeEventListener("click", once);
        characterFadeOut(characterGroup);
    }
    characterGroup.addEventListener("click", once);

    gameAnimation(characterGroup);
});

createCharacter();






