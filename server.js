require("dotenv").config();
const express = require("express");
const path = require("path");

const { sequelize, test } = require("./models"); //<--this is actually the database (very confusing way sequelize works but it does. You don't have to specify index.js, it defaults to index)

const app = express();

// ------------MIDDLEWARE--------------
// ------------------------------------------------------
// we'll allow either json or urlencoded requests
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies
app.use(express.json({ extended: false })); //Used to parse JSON bodies;
//------------------ ROUTES ----------------------------------

// GET DATA
app.get('/api', async (req, res) => {
    const { credentials } = req.body

    if (credentials === process.env.DB_SK) {
        try {
            let UserData = await test.findAll();

            if (UserData) {
                return res.status(400).json({ UserData }).send("Successful Retrieval");
            }
        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    } else {
        res.status(500).send('Server Error')
    }
})

// CREATE NEW DATA ROUND
app.post('/api', async (req, res) => {

    const { name } = req.body;

    try {
        await test.create({
            name
        });
        res.status(200).send({ msg: "info uploaded" })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});


// ---SERVE STATIC ASSETS FOR PRODUCTION -----
if (process.env.NODE_ENV === "production") {
    // set static folder. __dirname if file is in root
    app.use(express.static(__dirname));

    // Now assign the file to use to land on
    app.get("/", (req, res) => {
        res.sendFile(path.resolve(__dirname, "index.html"));
    })
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

// sequelize.sync({ alter: true });

// // //-------------------GET PORT TO LISTEN ON-----------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`running server on port ${PORT}`));