//------- INITIALIZE CORE GLOBAL GAME COMPONENTS-------
const playArea = document.getElementById("playArea");

// minimum 1320 890 resolution
let windowHeight = window.innerHeight;
let windowWidth = window.innerWidth;
if (windowWidth < 1320 || windowHeight < 890) {
    alert("Your window screen is too small. Please maximize.")
}

let score = 0;
let trialIteration = 0;
const numberOfRounds = 30;
const numberOfLevels = 6;
let currentRound = 1;
let level = 1;
let cursorX_enterOccluder = 0;
let cursorY_enterOccluder = 0;
let cursorX_exitOccluder = 0;
let cursorY_exitOccluder = 0;
let keepPlaying = true;
let success = false;
// attributes to send to database:
let currentRoundFeatures = {
    bg_color: '',
    eye_size: '',
    eye_color: '',
    mouth_w: '',
    mouth_h: '',
    horns_w: '',
    horns_h: ''
}

//------ direction animations:
let animRight = gsap.timeline();
let animLeft = gsap.timeline();

//------ initialze heads up display
document.getElementById("level").innerHTML = `Level : ${level}/${numberOfLevels}`;
document.getElementById("score").innerHTML = `Score : ${score}`;

//------ initialize sound
const soundEffect = document.getElementById("mySound")
//------ circle for click effect
const circleForEffect = document.createElementNS("http://www.w3.org/2000/svg", "circle");
// =========================== END CORE GLOBAL COMPONENTS ===========================

//=========================== GAME FUNCTIONS ========================================
let addScore = () => {
    success = true;
    return score += 1;
}
let addTrialIteration = () => {
    return trialIteration += 1;
}
let addRound = () => {
    return currentRound += 1;
}
let nextLevel = () => {
    level += 1;
}
let removeElement = (elementToRemove) => {
    elementToRemove.remove()
}
let checkGameOver = (characterToRemove) => {
    // POST ROUND TO DATABASE
    let data = {
        trialIteration: addTrialIteration(),
        success: success ? 1 : 0,
        condition: localStorage.getItem("gameVersion") === "version1" ? 1 : 2,
        bg_color: currentRoundFeatures.bg_color,
        eye_size: currentRoundFeatures.eye_size,
        eye_color: currentRoundFeatures.eye_color,
        mouth_w: currentRoundFeatures.mouth_w,
        mouth_h: currentRoundFeatures.mouth_h,
        horns_w: currentRoundFeatures.horns_w,
        horns_h: currentRoundFeatures.horns_h,
        subjectUID: localStorage.getItem("subject"),
        cursorX_enterOccluder, cursorY_enterOccluder, cursorX_exitOccluder, cursorY_exitOccluder, score,
    }
    const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    }
    fetch('/api/trial', options)

    // PERFORM ROUND LOGIC
    if (level === numberOfLevels && currentRound === numberOfRounds) {
        keepPlaying = false;
        alert('thanks for playing, you are all done!')
    } else if (score === numberOfRounds) {
        keepPlaying = false;
        alert('a perfect round! You are free to go!')
    } else if (currentRound === numberOfRounds) {
        keepPlaying = true;
        currentRound = 1;
        score = 0;
        level += 1;
        document.getElementById("level").innerHTML = `Level : ${level}/${numberOfLevels}`
        document.getElementById("score").innerHTML = `Score : ${score}`
        gameAnimation(createCharacter(), createOccluder()); //<!!!***RECURSIVELY STARTING ANOTHER ROUND***!!!
    } else {
        if (characterToRemove) {
            removeElement(characterToRemove)
        }
        addRound();
        document.getElementById("level").innerHTML = `Level : ${level}/${numberOfLevels}`
        document.getElementById("score").innerHTML = `Score : ${score}`
        gameAnimation(createCharacter(), createOccluder()); //<!!!***RECURSIVELY STARTING ANOTHER ROUND***!!!
    }
    console.log(`current round: ${currentRound}, level: ${level}, score: ${score}`)
}
let clearDirectionAnimations = () => {
    animRight.clear();
    animLeft.clear();
}
//------need to track mouse constantly:
let currentX = 0;
let currentY = 0;
let mouseCoordinate_window = (e) => {
    currentX = e.clientX;
    currentY = e.clientY;
}
document.addEventListener('mousemove', mouseCoordinate_window);

let mouseCoordinate_svg = () => {
    // Need to transform document screen space to svg coordinate space.
    const svgToTransform = document.getElementById("playArea");
    let pt = svgToTransform.createSVGPoint();
    pt.x = currentX;
    pt.y = currentY;
    let svgSpace = pt.matrixTransform(svgToTransform.getScreenCTM().inverse());

    // console.log(`[${svgSpace.x},${svgSpace.y}]`)
    return [`${svgSpace.x}`, `${svgSpace.y}`]
}
let mouseBeforeHidden = () => {
    let [x, y] = mouseCoordinate_svg();
    cursorX_enterOccluder = Math.round(x * 100 + Number.EPSILON) / 100;
    cursorY_enterOccluder = Math.round(y * 100 + Number.EPSILON) / 100;
}
let mouseAfterHidden = () => {
    let [x, y] = mouseCoordinate_svg();
    cursorX_exitOccluder = Math.round(x * 100 + Number.EPSILON) / 100;
    cursorY_exitOccluder = Math.round(y * 100 + Number.EPSILON) / 100;
}
let effectAnimation = () => {
    // Need to transform document screen space to svg coordinate space.
    const svgToTransform = document.getElementById("playArea");
    let pt = svgToTransform.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    let svgSpace = pt.matrixTransform(svgToTransform.getScreenCTM().inverse());

    circleForEffect.setAttribute("cx", svgSpace.x);
    circleForEffect.setAttribute("cy", svgSpace.y);
    circleForEffect.setAttribute("r", "1.9");
    circleForEffect.setAttribute("fill", "none");
    circleForEffect.setAttribute("stroke-width", "1.5");
    circleForEffect.setAttribute("stroke", "rgb(94, 179, 45)");
    document.getElementById("playArea").appendChild(circleForEffect);
    gsap.fromTo(circleForEffect, { scale: 1, opacity: 0.9 }, { scale: 1.6, opacity: 0, ease: "expo:out", transformOrigin: "center center", duration: 0.7 });
}
//=========================== Animation section ========================================
//******CHARACTER FADE OUT WHEN CLICKED and delete object when animmation is done
const characterFadeOut = (characterToFade, occluder) => {
    gsap.timeline({ onComplete: removeElement, onCompleteParams: [characterToFade] })
        .to(characterToFade, { duration: 0.5, scale: 1.2, opacity: 0, transformOrigin: "center center", onComplete: clearDirectionAnimations })
        .to(occluder, { duration: 1, y: 2, opacity: 0, scale: 1.1, transformOrigin: "center center", onComplete: checkGameOver, onCompleteParams: [characterToFade] }, "+=0.5")
}
//******ANIMATE RIGHT
const animateRight = (characterToAnimate, occluder) => {

    animRight.to(characterToAnimate, { duration: 0.5, x: 21, y: -30 })
    animRight.to(characterToAnimate, { duration: 0.5, opacity: 1, onComplete: mouseAfterHidden })
    animRight.to(characterToAnimate, { duration: 0.5, x: 46.5, y: -30, ease: "none", svgOrigin: "300 200" })
    animRight.to(occluder, { duration: 1, y: 2, opacity: 0, scale: 1.1, transformOrigin: "center center", onComplete: checkGameOver, onCompleteParams: [characterToAnimate] }, "+=0.5")
}
//******ANIMATE LEFT
const animateLeft = (characterToAnimate, occluder) => {

    animLeft.to(characterToAnimate, { duration: 0.5, x: -21, y: -30 })
    animLeft.to(characterToAnimate, { duration: 0.5, opacity: 1, onComplete: mouseAfterHidden })
    animLeft.to(characterToAnimate, { duration: 0.5, x: -46.5, y: -30, ease: "none" })
    animLeft.to(occluder, { duration: 1, y: 2, opacity: 0, scale: 1.1, transformOrigin: "center center", onComplete: checkGameOver, onCompleteParams: [characterToAnimate] }, "+=0.5")
}
//******MAIN GAME ANIMATION (CLICK CHECK INITIATES IN HERE)*****
const gameAnimation = (characterToAnimate, occluder) => {
    success = false; //<-- need to reset this every round

    let eyeSize = characterToAnimate.childNodes[2].getAttribute("r")

    let directionToAnimate = () => {
        //---------- Random Direction -----------
        if (localStorage.getItem("gameVersion") === "version1") {
            if (Math.random() >= 0.5) {
                return animateRight(characterToAnimate, occluder);
            } else {
                return animateLeft(characterToAnimate, occluder);
            }
        } else
        //---------- Dictated by eye size -----------
        {
            if (eyeSize == "1.6") {
                return animateRight(characterToAnimate, occluder);
            } else {
                return animateLeft(characterToAnimate, occluder);
            }
        }
    }
    // make character clickable only once per round
    const once = () => {
        soundEffect.play();
        effectAnimation();
        characterToAnimate.removeEventListener("mousedown", once);
        document.getElementById("score").innerHTML = `Score : ${addScore()}`;
        characterFadeOut(characterToAnimate, occluder);
    }
    // provide listener to animation below only after character goes behind occluder/blocker
    // also tracking coordinates before character goes behind occluder
    let provideListener = () => {
        characterToAnimate.addEventListener("mousedown", once);
        mouseBeforeHidden();
    }
    // character animates on, goes behind occluder, then passes off to direction animation
    gsap.timeline({ onComplete: directionToAnimate, onCompleteParams: [characterToAnimate, occluder] })
        .from(occluder, { duration: 1, y: 2, opacity: 0 }, "+=0.5")
        .from(characterToAnimate, { duration: 1.5, y: 30, ease: "elastic.out(1,1)" }, "+=1")
        .to(characterToAnimate, { duration: 1, y: -16.4, ease: "power2.in", onComplete: provideListener }, "+=2")
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
    bodyColor: ["rgb(209, 51, 40)", "rgb(135, 135, 135)"],
    // mouthWidth and Height assigned in randomFeature()
    // hornWidth and Height assigned in randomFeature()
}
let randomFeature = () => {
    return {
        eyeColor: features.eyeColor[Math.floor(Math.random() * 2)][Math.floor(Math.random() * 6)],
        eyeSize: features.eyeSize[Math.floor(Math.random() * 2)],
        bodyColor: features.bodyColor[Math.floor(Math.random() * 2)],
        hornWidth: Math.floor(Math.random() * 2) + 1,
        hornHeight: Math.floor(Math.random() * 7) + 1,
        mouthWidth: Math.floor(Math.random() * 5) + 1,
        mouthHeight: Math.floor(Math.random() * 2) + 1
    }
}
const createOccluder = () => {

    let occluder = document.createElementNS("http://www.w3.org/2000/svg", "path");
    occluder.setAttribute("id", "blocker");
    occluder.setAttribute("d", "m18.1753,1.821852c0,0 24.29116,24.21453 24.29116,24.21453c0,0 24.44442,-24.06128 24.44442,-24.06128c0,0 0,20.68964 0,20.68964c0,0 -13.40995,13.5632 -13.40995,13.5632c0,0 -21.99231,-0.07663 -22.00194,-0.11737c0.00963,0.04074 -13.40032,-13.59909 -13.40994,-13.63983c0.00962,-0.03589 0.08625,-20.64889 0.08625,-20.648z");
    occluder.setAttribute("stroke-width", "1.5");
    occluder.setAttribute("stroke", "rgba(0,0,0,1)");
    occluder.setAttribute("fill", "rgba(0,0,0,1)");

    // ---attach to svg ---
    document.getElementById("playArea").appendChild(occluder);
    return occluder;
}
const createCharacter = (() => {

    let characterAttributes = randomFeature();

    currentRoundFeatures = {
        bg_color: characterAttributes.bodyColor,
        eye_size: characterAttributes.eyeSize,
        eye_color: characterAttributes.eyeColor,
        mouth_w: characterAttributes.mouthWidth,
        mouth_h: characterAttributes.mouthHeight,
        horns_w: characterAttributes.hornWidth,
        horns_h: characterAttributes.hornHeight
    }
    console.log(currentRoundFeatures);

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
    mouth.setAttribute("width", `${characterAttributes.mouthWidth}`);
    mouth.setAttribute("height", `${characterAttributes.mouthHeight}`);
    mouth.setAttribute("x", `${42.6 - characterAttributes.mouthWidth / 2}`);
    mouth.setAttribute("y", `${51 - characterAttributes.mouthHeight / 2}`);
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



    return (characterGroup)
});
//<!!!***RECURSIVE THROUGH "checkGameOver = (characterToRemove)" FUNCTION***!!!
// createCharacter() returns a collection "<g>" of svg elements to attach to parent svg on the game page.
// createOccluder() returns the occluder object to animate on and off screen per round.
if (windowWidth > 1320 && windowHeight > 890) {
    gameAnimation(createCharacter(), createOccluder());
}






