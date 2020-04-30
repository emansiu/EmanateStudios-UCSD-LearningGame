// animation functions
let slideOn = (objectToAdd) => {
    gsap.from(objectToAdd, { duration: 1, y: -10, ease: "power2.in", opacity: 0, stagger: 0.1 })
}
let slideOff = (objectToRemove) => {
    gsap.to(objectToRemove, { duration: 1, y: 10, ease: "power2.in", opacity: 0 })
}

// get form
let form = document.getElementById('signup')

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    let number = form.elements["subjectNumber"].value;
    let initials = form.elements["initials"].value;
    let data = { number, initials }

    const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    }
    await fetch('/api/subject', options)

    window.location.href = "/pages/game.html";
});

console.log(window.location.hostname);
// animate form on
let ps = document.getElementsByTagName("form")
let pTag = document.getElementsByTagName("p")

slideOn(ps);
slideOn(pTag);