//Section 1: Dependencies (with npm install)
const express = require('express');
const path = require('path');

//Import routes
const studyRoutes = require("./routes/studyRoutes");
const indexRoutes = require("./routes/indexRoutes");


//Section 2: Instantiations
const app = express();
const port = 3005;

//Section 3: Configurations
app.set('view engine','pug'); //Setting Pug as a view engine
app.set('views', path.join(__dirname, 'views')); //Specifying folder containing frontend files

//Section 4: Middleware

app.use('/about', (req, res, next) => {
  console.log('A new request received at ' + Date.now());
  next();
});

// To parse URL encoded data. VERY IMPORTANT LINE OF CODE. It is the transporter of data to db
app.use(express.urlencoded({ extended: false }));

//To post static files: Telling application that all public files will be in the root folder
app.use(express.static(path.join(__dirname,'public')));

//Express session configs...For authentication

//Section 5: Use imported Routes
app.use("/study", studyRoutes);
app.use("/", indexRoutes);

//for non exixtent routes: always above server
app.use((req, res) => {
  res.status(404).send('Oops! Route not found.');
});


//Section 6: Bootstrapping Server/starting server
//This should always be the last line in this file
app.listen(port, () => console.log(`listening on port ${port}`));