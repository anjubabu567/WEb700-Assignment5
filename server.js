/********************************************************************************
* WEB700 – Assignment 05
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Anju Babu Student ID: 115640245 Date: 17-07-2025
*
* Published URL: ___________________________________________________________
*
********************************************************************************/
const express = require('express');
const app = express();
const path = require('path');
const LegoData = require('./modules/legoSets'); 
const legoData = new LegoData();

const HTTP_PORT = process.env.PORT || 8080;

// Configure express.static middleware to serve static files from the 'public' folder 
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse urlencoded form data
app.use(express.urlencoded({ extended: true }));

// Configure EJS as the view engine
app.set('view engine', 'ejs');
// Set the views directory for EJS (important for Vercel)
app.set('views', path.join(__dirname, '/views'));

// Routes
app.get('/', (req, res) => {
    res.render("home", { page: "/" }); 
});

app.get('/about', (req, res) => {
    res.render("about", { page: "/about" });
});

app.get('/lego/sets', (req, res) => {
    if (req.query.theme) {
        legoData.getSetsByTheme(req.query.theme)
            .then(data => {
                res.render("sets", { sets: data, page: "/lego/sets" }); 
            })
            .catch(err => {
                res.status(404).render("404", { message: err, page: "" }); 
            });
    } else {
        legoData.getAllSets()
            .then(data => {
                res.render("sets", { sets: data, page: "/lego/sets" }); 
            })
            .catch(err => {
                res.status(404).render("404", { message: err, page: "" }); 
            });
    }
});

app.get('/lego/sets/:setNum', (req, res) => {
    legoData.getSetByNum(req.params.setNum)
        .then(data => {
            res.render("set", { set: data, page: "" }); 
        })
        .catch(err => {
            res.status(404).render("404", { message: err, page: "" }); 
        });
});


app.get("/lego/addSet", (req, res) => {
  legoData.getAllThemes() // Fetch all themes
    .then(themes => {
      res.render("addSet", { themes: themes, page: "/lego/addSet" });
    })
    .catch(err => {
      // Handle error if themes can't be fetched
      res.status(500).render("404", { message: "Error fetching themes: " + err, page: "" });
    });
});


app.post("/lego/addSet", (req, res) => {
  
  legoData.getThemeById(req.body.theme_id)
    .then(foundTheme => {
      
      req.body.theme = foundTheme.name; 
      return legoData.addSet(req.body);
    })
    .then(() => {
      res.redirect("/lego/sets"); 
    })
    .catch(err => {
     
      res.status(500).send("Error adding set: " + err); 
    });
});

//Deleting a Set
app.get("/lego/deleteSet/:set_num", async (req, res) => {
    try {
        await legoData.deleteSetByNum(req.params.set_num);
        res.redirect("/lego/sets");
    } catch (err) {
        res.status(404).render("404", { message: err, page: "" });
    }
});


app.use((req, res) => {
    res.status(404).render("404", { page: "" }); 
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
