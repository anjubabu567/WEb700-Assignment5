/********************************************************************************
* WEB700 – Assignment 04
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Anju Babu Student ID: 115640245 Date: 03-07-2025
*
* Published URL: ___________________________________________________________
*
********************************************************************************/

const express = require('express');
const app = express();
const path = require('path');
const LegoData = require('./modules/legoSets'); // Require the class directly

const legoData = new LegoData(); // Instantiate the class [note: this is a change from Assignment 3's structure]

const HTTP_PORT = process.env.PORT || 8080;

// Configure express.static middleware to serve static files from the 'public' folder 
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get('/lego/sets', (req, res) => {
    if (req.query.theme) {
        legoData.getSetsByTheme(req.query.theme)
            .then(data => res.json(data))
            .catch(err => res.status(404).send(err));
    } else {
        legoData.getAllSets()
            .then(data => res.json(data))
            .catch(err => res.status(404).send(err));
    }
});

app.get('/lego/sets/:setNum', (req, res) => {
    legoData.getSetByNum(req.params.setNum)
        .then(data => res.json(data))
        .catch(err => res.status(404).send(err));
});

// New route to test addSet functionality [cite: 33]
app.get('/lego/add-test', (req, res) => {
    let testSet = {
        set_num: "A001", // Using a unique set_num to avoid conflicts with existing data in setData.json
        name: "Test New Lego Set",
        year: "2025",
        theme_id: "1", // Assuming theme_id '1' exists in themeData.json (e.g., "Technic")
        num_parts: "150",
        img_url: "https://fakeimg.pl/375x375?text=[+New+Lego+Set+]"
    };

    legoData.addSet(testSet)
        .then(() => {
            console.log("Test set added successfully.");
            res.redirect('/lego/sets'); // Redirect to /lego/sets on success [cite: 33]
        })
        .catch(err => {
            console.error("Error adding test set:", err);
            res.status(422).send(err); // Set status to 422 and return error on failure [cite: 33]
        });
});


// Custom 404 route
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
});

// Initialize legoData and start the server
legoData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`server listening on: http://localhost:${HTTP_PORT}`);
        });
    })
    .catch(err => {
        console.error(`Error initializing data: ${err}`);
    });