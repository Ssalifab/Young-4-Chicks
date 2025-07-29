//Section 1: Dependencies (with npm install)
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const moment = require('moment');
const expressSession = require('express-session')({
  secret: 'bukomansimbi',
  resave: false,
  saveUninitialized: false
});

require('dotenv').config(); //configuration of dotenv in server file

//Import User Model
const user = require('./models/signupModal')

//Import routes
const studyRoutes = require("./routes/studyRoutes");
const indexRoutes = require("./routes/indexRoutes");
const authRoutes = require("./routes/authRoutes");
const staffRoutes = require("./routes/staffRoutes");
const farmerRoutes = require("./routes/farmerRoutes");


//Section 2: Instantiations
const app = express();
const port = 3005;

//Section 3: Configurations
app.locals.moment=moment;
mongoose.connect(process.env.DATABASE);
mongoose.connection
.once("open",()=>{
  console.log("Mongoose connection is open!");
})
.on("error", (error)=>{
  console.error(`Connection error: ${error.message}`)
});

app.set('view engine','pug'); //Setting Pug as a view engine
app.set('views', path.join(__dirname, 'views')); //Specifying folder containing frontend files

//Section 4: Middleware
// To parse URL encoded data. VERY IMPORTANT LINE OF CODE. It is the transporter of data to db
app.use(express.urlencoded({ extended: false }));

//To post static files: Telling application that all public files will be in the root folder
app.use(express.static(path.join(__dirname,'public')));

//Express session configs...For authentication
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());

//Passport Configs
passport.use(user.createStrategy());
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


//Section 5: Use imported Routes
app.use("/study", studyRoutes);
app.use("/", indexRoutes);
app.use("/", authRoutes);
app.use("/", staffRoutes);
app.use("/", farmerRoutes);

//for non exixtent routes: always above server
app.use((req, res) => {
  res.status(404).send('Oops! Route not found.');
});


//Section 6: Bootstrapping Server/starting server
//This should always be the last line in this file
app.listen(port, () => console.log(`listening on port ${port}`));