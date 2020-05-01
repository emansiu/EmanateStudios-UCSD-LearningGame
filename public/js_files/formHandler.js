//----- animation functions
let slideOn = (objectToAdd) => {
    gsap.from(objectToAdd, { duration: 1, y: -10, ease: "power2.in", opacity: 0, stagger: 0.1 })
}
let slideOff = (objectToRemove) => {
    gsap.to(objectToRemove, { duration: 1, y: 10, ease: "power2.in", opacity: 0 })
}

//================== INITIAL VARIABLES / FUNCTIONS ======================
let timeOnPageLoad = moment().format('YYYY-MM-DD h:mm:ss.ms'); //<--recorded as soon as page is loaded
const gameVersion = document.getElementById("gameMenu").getAttribute("assignment")
// ACQUIRE ALL FORMS FROM PAGE
// DOM elements need to be assigned to array first 
let AllForms = [...document.getElementsByTagName("form")]

//***!!!---- ALL FORMS FROM ALL PAGES HANDLED IN THIS SWITCH CASE -----!!*****
AllForms.forEach(form => {

    switch (form.getAttribute("id")) {
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
                localStorage.setItem("gameVersion", gameVersion)
                const options = {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: { 'Content-Type': 'application/json' }
                }
                const newUser = await fetch('/api/subject', options)
                const returnedData = await newUser.json();
                // console.log(JSON.parse(newUser).UID);
                localStorage.setItem("subject", returnedData.subject)

                // window.location.href = "/pages/v1.html";
            });
            break;
        case '2':
            console.log('doing 2 too')
            break;
        default:
        //do nothing
    }
})



// animate form on
let ps = document.getElementsByTagName("form")
let pTag = document.getElementsByTagName("p")

slideOn(ps);
slideOn(pTag);