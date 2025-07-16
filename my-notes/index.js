//Section 1: Dependencies (with npm install)
const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); //This will help connect to mongo db
const passport = require('passport');
const expressSession = require('express-session')({
secret: 'Bukomansimbi',
resave: false,
saveUninitialized: false
});

require('dotenv').config();
//Import the user Model
const User = require('./models/user')

//Import routes
const studyRoutes = require("./routes/studyRoutes");
const indexRoutes = require('./routes/indexRoutes');
const chickRoutes = require("./routes/chickRoutes");
const farmerRoutes = require('./routes/farmerRoutes');
const salesDashboardRoutes = require('./routes/salesDashboardRoutes');
const authRoutes = require('./routes/authRoutes');



//Section 2: Instantiations
const app = express();
const port = 3000;

//Section 3: Configurations
mongoose.connect(process.env.DATABASE); 
mongoose.connection
.once('open', ()=>{
  console.log('Mongoose connection open!');
})

.on('error', (error) =>{
  console.error(`Connection error: ${error.message}`)
});

app.set('view engine', 'pug'); //setting pug as view engine
app.set('views', path.join(__dirname, 'views')); //Specifying folder containing-front end files

//Section 4: Middleware
//Simple request time logger for a specific route
// app.use((req, res, next) => {
//   console.log('A new request received at ' + Date.now());
//   next();
// });

app.use('/about', (req, res, next) => {
  console.log('A new request received at ' + Date.now());
  next();
});

// To parse URL encoded data. VERY IMPORTANT LINE OF CODE. It is the transporter of data to db
app.use(express.urlencoded({ extended: false }));

//To post static files: Telling application that all public files will be in the root folder
app.use(express.static(path.join(__dirname,'public')));

//Express session configs...For authentication
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());

//Passport configs
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//Section 5: Routes
app.use('/study', studyRoutes);
app.use('/', indexRoutes);
app.use('/', chickRoutes);
app.use('/', farmerRoutes);
app.use('/', salesDashboardRoutes);
app.use('/', authRoutes);

//for non exixtent routes: always above server
app.use((req, res) => {
  res.status(404).send('Oops! Route not found.');
});


//Section 6: Bootstrapping Server
//Start the server
//This should always be the last line in this file
app.listen(port, () => console.log(`listening on port ${port}`));