//------- INITIALIZE CORE GLOBAL GAME COMPONENTS-------
const playArea = document.getElementById("playArea");

let windowHeight = window.innerHeight;
let windowWidth = window.innerWidth;

playArea.setAttribute("height", `${'100%'}`);
playArea.setAttribute("width", `${'100%'}`);

// ----------- END CORE GLOBAL COMPONENTS---------------



//=========================== Animation section ========================================
// gsap.to("#demon", { duration: 10, x: 50, scale: 0.5 });



let clickCount = 0
// document.getElementById("demon").addEventListener("click", function () {
//     console.log(`you clicked me ${clickCount += 1} times`)
//     gsap.to("#demon", { duration: 0.5, scale: 1, opacity: 0 });
// })

const characterFadeOut = (characterToFade) => {
    gsap.to(characterToFade, { duration: 0.5, scale: 1, opacity: 0, transformOrigin: "center center" });
}

const gameAnimation = (characterToAnimate) => {
    gsap.timeline()
        .to(characterToAnimate, { duration: 1, y: -30 })
        .to(characterToAnimate, { duration: 1, x: 30 })
}

const createCharacter = (() => {


    // create g tag
    let characterGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    // characterGroup.setAttribute("fill", "none");
    characterGroup.setAttribute("id", "character");

    // create a left eye
    let leftEye = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    leftEye.setAttribute("cx", "30");
    leftEye.setAttribute("cy", "56.25");
    leftEye.setAttribute("r", "2");
    leftEye.setAttribute("fill", "red");
    // create a right eye
    let rightEye = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    rightEye.setAttribute("cx", "50");
    rightEye.setAttribute("cy", "56.25");
    rightEye.setAttribute("r", "2");
    rightEye.setAttribute("fill", "red");

    // attach it to the container group (characterGroup)
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






