require("dotenv").config();
const express = require("express");
const path = require("path");

const { sequelize, subject, exitInterview, trial, quiz } = require("./models"); //<--this is actually the database (very confusing way sequelize works but it does. You don't have to specify index.js, it defaults to index)

const app = express();
// ------------MIDDLEWARE--------------
// ------------------------------------------------------
// we'll allow either json or urlencoded requests
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies
app.use(express.json({ extended: false })); //Used to parse JSON bodies;
//------------------ ROUTES ----------------------------------

//================ALL THE GET DATA================
app.get('/api/subject', async (req, res) => {
    const { credentials } = req.body

    if (credentials === process.env.DB_SK) {
        try {
            let Subjects = await subject.findAll();

            if (Subjects) {
                return res.status(400).json({ Subjects })
            }
        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    } else {
        res.status(500).send('Not authorized for this route')
    }
})

//================ALL THE POST DATA================
// CREATE EXIT INTERVIEW
app.post('/api/exit', async (req, res) => {

    const { finish_date_time, condition, hunch1, hunch1_level, hunch2, hunch2_level, hunch3, hunch3_level, has_hunch, last_action, completed_block_100percent_after_trial, aborted, blur_1_seconds, blur_2_seconds } = req.body;

    try {
        // first create new subject
        await exitInterview.create({
            finish_date_time, condition, hunch1, hunch1_level, hunch2, hunch2_level, hunch3, hunch3_level, has_hunch, last_action, completed_block_100percent_after_trial, aborted, blur_1_seconds, blur_2_seconds
        });

        res.status(200).send({ msg: "Exit Interview Added Successfully" })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});
// CREATE QUIZ TABLE
app.post('/api/quiz', async (req, res) => {

    const { startTime_quiz, endTime_quiz } = req.body;

    try {
        // first create new subject
        await quiz.create({
            startTime_quiz, endTime_quiz
        });

        res.status(200).send({ msg: "Quiz Added Successfully" })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});
// CREATE NEW DATA SUBJECT
app.post('/api/subject', async (req, res) => {

    const { startTime_consent, endTime_consent, firstName, lastName, email, wantsConsentEmailed } = req.body;

    try {
        // first create new subject
        const newSubject = await subject.create({
            startTime_consent, endTime_consent, firstName, lastName, email, wantsConsentEmailed
        });
        res.status(200).json({ subject: newSubject.UID })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});
// CREATE NEW TRIAL ASSIGNED TO SUBJECT
app.post('/api/trial', async (req, res) => {

    const { trialIteration, score, condition, cursorX_exitOccluder, cursorY_exitOccluder, cursorX_enterOccluder, cursorY_enterOccluder, success, bg_color, eye_size, eye_color, mouth_w, mouth_h, horns_w, horns_h, SubjectId } = req.body;

    try {
        // first create new subject
        await trial.create({
            trialIteration, score, condition, cursorX_exitOccluder, cursorY_exitOccluder, cursorX_enterOccluder, cursorY_enterOccluder, success, bg_color, eye_size, eye_color, mouth_w, mouth_h, horns_w, horns_h, SubjectId
        });

        res.status(200).send({ msg: "Trial Round Successfully" })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});


// ---SERVE STATIC ASSETS FOR PRODUCTION AND DEV-----
if (process.env.NODE_ENV === "production") {
    // set static folder. __dirname if file is in root
    app.use(express.static(__dirname));

    // Now assign the file to use to land on
    app.get("/", (req, res) => {
        res.sendFile(path.resolve(__dirname, "index.html"));
    })
} else {
    app.use(express.static('public'))
}


// ----------------TEST CONNECTION------------------
sequelize
    .authenticate()
    .then(() => {
        console.log("Connection has been established successfully.");
    })
    .then(() => { })
    .catch(err => {
        console.error("Unable to connect to the database:", err);
    });

// sequelize.sync({ force: true });

// // //-------------------GET PORT TO LISTEN ON-----------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`running server on port ${PORT}`));