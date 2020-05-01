//----- animation functions
let slideOn = (objectToAdd) => {
    gsap.from(objectToAdd, { duration: 1, y: -10, ease: "power2.in", opacity: 0, stagger: 0.1 })
}
let slideOff = (objectToRemove) => {
    gsap.to(objectToRemove, { duration: 1, y: 10, ease: "power2.in", opacity: 0 })
}

//================== INITIAL VARIABLES / FUNCTIONS ======================
let timeOnPageLoad = moment().format('YYYY-MM-DD h:mm:ss.ms'); //<--recorded as soon as page is loaded

let getGameVersion = () => {
    if (localStorage.getItem("gameVersion") == null) {
        return document.getElementById("gameMenu").getAttribute("assignment");
    }
    return ""
}
// ACQUIRE ALL FORMS FROM PAGE
// DOM elements need to be assigned to array first 
let AllForms = [...document.getElementsByTagName("form")]

//***!!!---- ALL FORMS FROM ALL PAGES HANDLED IN THIS SWITCH CASE -----!!*****
AllForms.forEach(form => {

    switch (form.getAttribute("id")) {
        // --------------CONSENT FORM ------------------
        case 'consent':
            form.addEventListener('submit', async (event) => {
                event.preventDefault();

                let data = {
                    startTime_consent: timeOnPageLoad,
                    endTime_consent: moment().format('YYYY-MM-DD h:mm:ss.ms'),
                    firstName: form.elements["firstName"].value,
                    lastName: form.elements["lastName"].value,
                    email: form.elements["lastName"].value,
                    wantsConsentEmailed: form.elements["sendEmail"].checked
                }

                // add version to local storage on client system
                localStorage.setItem("gameVersion", getGameVersion())
                const options = {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: { 'Content-Type': 'application/json' }
                }
                const newUser = await fetch('/api/subject', options)
                const returnedData = await newUser.json();
                localStorage.setItem("subject", returnedData.subject)//<--temporarily provide persisted data to local storage. Removed on errors or at end of game.
                window.location.href = "/pages/demographics.html";
            });
            break;
        // --------------DEMOGRAPHICS FORM ------------------
        case 'demographics':
            form.addEventListener('submit', async (event) => {
                event.preventDefault();

                let data = {
                    age: form.elements["age"].value,
                    gender: form.elements["gender"].value,
                    demographic: form.elements["demographic"].value
                }
                const options = {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: { 'Content-Type': 'application/json' }
                }
                await fetch('/api/demographic', options)
                window.location.href = "/pages/instructions.html";
            });
            break;
        // --------------QUIZ FORM ------------------
        case 'quiz':
            form.addEventListener('submit', async (event) => {
                event.preventDefault();

                let data = {
                    startTime_quiz: timeOnPageLoad,
                    endTime_quiz: moment().format('YYYY-MM-DD h:mm:ss.ms'),
                    subjectUID: localStorage.getItem("subject")
                }
                const options = {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: { 'Content-Type': 'application/json' }
                }
                if (form.elements["q1"].value === "2" &&
                    form.elements["q2"].value === "3" &&
                    form.elements["q3"].value === "1" &&
                    form.elements["q4"].value === "2" &&
                    form.elements["q5"].value === "2" &&
                    form.elements["q6"].value === "3") {
                    try {
                        await fetch('/api/quiz', options)
                        window.location.href = "/pages/game.html";
                    } catch (err) {
                        console.error(err)
                    }
                } else {
                    try {
                        await fetch('/api/quiz', options)
                        window.location.href = "/pages/failedInstructions.html";
                    } catch (err) {
                        console.error(err);
                    }
                }


            });
            break;

        default:
        //do nothing
    }
})



// animate form on
let ps = document.getElementsByTagName("form")
let pTag = document.getElementsByTagName("p")
let h2Tag = document.getElementsByTagName("h2")

slideOn(ps);
slideOn(pTag);
slideOn(h2Tag);