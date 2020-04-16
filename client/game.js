//------- INITIALIZE CORE GLOBAL GAME COMPONENTS-------

// ----------- END CORE GLOBAL COMPONENTS---------------



gsap.to("#gear", { duration: 2, scale: 0.5 });


document.getElementById("gear").addEventListener("click", function () {
    document.getElementById("demo").innerHTML = "Hello World";
});