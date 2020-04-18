//------- INITIALIZE CORE GLOBAL GAME COMPONENTS-------
const playArea = document.getElementById("playArea");

let windowHeight = window.innerHeight;
let windowWidth = window.innerWidth;

playArea.setAttribute("height", `${'100%'}`);
playArea.setAttribute("width", `${'100%'}`);

let score = 0;
let round = 0;
let level = 1;

// ----------- END CORE GLOBAL COMPONENTS---------------

//=========================== Game functions ========================================
let addScore = () => {
    return score += 1;
}
let addRound = () => {
    return round += 1;
}
let resetScore = () => {
    score = 0;
}
let resetRound = () => {
    score = 0;
}
let nextLevel = () => {
    level += 1;
}
let removeElement = (elementToRemove) => {
    elementToRemove.remove()
}


//=========================== Animation section ========================================
//******CHARACTER FADE OUT WHEN CLICKED
const characterFadeOut = (characterToFade) => {
    gsap.timeline({ onComplete: removeElement, onCompleteParams: [characterToFade] })
        .to(characterToFade, { duration: 0.5, scale: 1.2, opacity: 0, transformOrigin: "center center" })
}
//******ANIMATE RIGHT
const animateRight = (characterToAnimate) => {
    gsap.timeline()
        .to(characterToAnimate, { duration: 0.5, x: 21, y: -30 })
        .to(characterToAnimate, { duration: 0.5, opacity: 1 })
        .to(characterToAnimate, { duration: 0.5, x: 47, y: -30, ease: "none" })
}
//******ANIMATE LEFT
const animateLeft = (characterToAnimate) => {
    gsap.timeline()
        .to(characterToAnimate, { duration: 0.5, x: -21, y: -30 })
        .to(characterToAnimate, { duration: 0.5, opacity: 1 })
        .to(characterToAnimate, { duration: 0.5, x: -47, y: -30, ease: "none" })
}
//******MAIN GAME ANIMATION
const gameAnimation = async (characterToAnimate, occluder) => {

    let eyeSize = characterToAnimate.childNodes[2].getAttribute("r")

    let directionToAnimate = () => {
        if (eyeSize == "1.6") {
            return animateRight(characterToAnimate);
        } else {
            return animateLeft(characterToAnimate);
        }
    }

    await gsap.timeline({ onComplete: directionToAnimate, onCompleteParams: [characterToAnimate] })
        .from(occluder, { duration: 1, y: 2, opacity: 0 }, "+=0.5")
        .from(characterToAnimate, { duration: 1.5, y: 30, ease: "elastic.out(1,1)" }, "+=1")
        .to(characterToAnimate, { duration: 1, y: -16.4, ease: "power2.in" }, "+=2")
        .to(characterToAnimate, { duration: 0.5, opacity: 0 })

}

//=========================== ELEMENTS TO CREATE ========================================
const features = {
    eyeColor: [
        // yellow shades
        ["rgb(252, 186, 3)", "rgb(255, 204, 61)", "rgb(255, 220, 122)", "rgb(201, 148, 0)", "rgb(161, 118, 0)"]
        ,
        // blue shades
        ["rgb(92, 198, 255)", "rgb(41, 180, 255)", "rgb(0, 166, 255)", "rgb(0, 131, 201)", "rgb(0, 98, 150)"]
    ],
    eyeSize: ["0.8", "1.6"],
    bodyColor: ["rgb(209, 51, 40)", "rgb(135, 135, 135)"]
}


let randomFeature = () => {
    return {
        eyeColor: features.eyeColor[Math.floor(Math.random() * 2)][Math.floor(Math.random() * 6)],
        eyeSize: features.eyeSize[Math.floor(Math.random() * 2)],
        bodyColor: features.bodyColor[Math.floor(Math.random() * 2)],
        hornWidth: Math.floor(Math.random() * 2) + 1,
        hornHeight: Math.floor(Math.random() * 7) + 1
    }
}

const createOccluder = () => {

    let occluder = document.createElementNS("http://www.w3.org/2000/svg", "path");
    occluder.setAttribute("id", "blocker");
    occluder.setAttribute("d", "m18.1753,1.821852c0,0 24.29116,24.21453 24.29116,24.21453c0,0 24.44442,-24.06128 24.44442,-24.06128c0,0 0,20.68964 0,20.68964c0,0 -13.40995,13.5632 -13.40995,13.5632c0,0 -21.99231,-0.07663 -22.00194,-0.11737c0.00963,0.04074 -13.40032,-13.59909 -13.40994,-13.63983c0.00962,-0.03589 0.08625,-20.64889 0.08625,-20.64889z");
    occluder.setAttribute("stroke-width", "1.5");
    occluder.setAttribute("stroke", "#000");
    occluder.setAttribute("fill", "#000000");

    // ---attach to svg ---
    document.getElementById("playArea").appendChild(occluder);
    return occluder;
}

const createCharacter = (() => {

    let characterAttributes = randomFeature();

    // create g tag (group that holds all pieces of character)
    let characterGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    characterGroup.setAttribute("id", "character");

    // ------ create body ------------
    let body = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    body.setAttribute("width", "8");
    body.setAttribute("height", "8");
    body.setAttribute("x", "38.5");
    body.setAttribute("y", "45");
    body.setAttribute("fill", characterAttributes.bodyColor);
    // ------ create left eye sclera ------------
    let leftEyeWhites = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    leftEyeWhites.setAttribute("cx", "40.5");
    leftEyeWhites.setAttribute("cy", "47.5");
    leftEyeWhites.setAttribute("r", "1.8");
    leftEyeWhites.setAttribute("fill", "white");
    // ------ create left eye pupil ------------
    let leftEye = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    leftEye.setAttribute("cx", "40.5");
    leftEye.setAttribute("cy", "47.5");
    leftEye.setAttribute("r", characterAttributes.eyeSize);
    leftEye.setAttribute("fill", characterAttributes.eyeColor);
    // ------ create right eye sclera------------
    let rightEyeWhites = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    rightEyeWhites.setAttribute("cx", "44.5");
    rightEyeWhites.setAttribute("cy", "47.5");
    rightEyeWhites.setAttribute("r", "1.8");
    rightEyeWhites.setAttribute("fill", "white");
    // ------ create right eye pupil------------
    let rightEye = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    rightEye.setAttribute("cx", "44.5");
    rightEye.setAttribute("cy", "47.5");
    rightEye.setAttribute("r", characterAttributes.eyeSize);
    rightEye.setAttribute("fill", characterAttributes.eyeColor);
    // ------ create left horn ------------
    let leftHorn = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    leftHorn.setAttribute("points", `38.5,45 ${38.5 + characterAttributes.hornWidth},45 ${38.5 + (characterAttributes.hornWidth / 2)},${45 - characterAttributes.hornHeight}`);
    leftHorn.setAttribute("style", `fill:${characterAttributes.bodyColor}`);
    // ------ create right horn ------------
    let rightHorn = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    rightHorn.setAttribute("points", `${46.5 - characterAttributes.hornWidth},45 46.5,45 ${46.5 - (characterAttributes.hornWidth / 2)},${45 - characterAttributes.hornHeight}`);
    rightHorn.setAttribute("style", `fill:${characterAttributes.bodyColor}`);
    // ------ create mouth ------------
    let mouth = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    mouth.setAttribute("width", "3");
    mouth.setAttribute("height", "0.5");
    mouth.setAttribute("x", "41");
    mouth.setAttribute("y", "51");
    mouth.setAttribute("fill", "black");

    //---- attach it to the container group (characterGroup) ----
    characterGroup.appendChild(body);
    characterGroup.appendChild(leftEyeWhites);
    characterGroup.appendChild(leftEye);
    characterGroup.appendChild(rightEyeWhites);
    characterGroup.appendChild(rightEye);
    characterGroup.appendChild(leftHorn);
    characterGroup.appendChild(rightHorn);
    characterGroup.appendChild(mouth);

    //---- attach to static svg on page ----
    document.getElementById("playArea").appendChild(characterGroup);

    // make character clickable only once per round

    const once = () => {
        characterGroup.removeEventListener("mousedown", once);
        document.getElementById("score").innerHTML = `Score : ${addScore()}`;
        characterFadeOut(characterGroup);

    }
    characterGroup.addEventListener("mousedown", once);

    return (characterGroup)
});


// for (i = 1; i = level; i++) {

// }

gameAnimation(createCharacter(), createOccluder());
gameAnimation(createCharacter(), createOccluder());





