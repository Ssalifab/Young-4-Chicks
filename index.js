// Section 1: Dependencies (with npm install)
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const moment = require('moment');
const session = require('express-session');
const flash = require('connect-flash'); 
require('dotenv').config();

// Import User Model
const user = require('./models/signupModal');

// Import routes
const studyRoutes = require("./routes/studyRoutes");
const indexRoutes = require("./routes/indexRoutes");
const authRoutes = require("./routes/authRoutes");
const staffRoutes = require("./routes/staffRoutes");
const farmerRoutes = require("./routes/farmerRoutes");

// Section 2: Instantiations
const app = express();
const port = 3005;

// Section 3: Configurations
app.locals.moment = moment;
mongoose.connect(process.env.DATABASE);
mongoose.connection
  .once("open", () => {
    console.log("Mongoose connection is open!");
  })
  .on("error", (error) => {
    console.error(`Connection error: ${error.message}`);
  });

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Section 4: Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Updated session configuration
app.use(session({
  secret: 'bukomansimbi',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Auto HTTPS in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize flash AFTER session
app.use(flash());

// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg = req.flash('error');
  next();
});

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(user.createStrategy());
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

// Section 5: Use imported Routes
app.use("/", studyRoutes);
app.use("/", indexRoutes);
app.use("/", authRoutes);
app.use("/", staffRoutes);
app.use("/", farmerRoutes);

// For non-existent routes
app.use((req, res) => {
  res.status(404).send('Oops! Route not found.');
});

// Section 6: Bootstrapping Server
app.listen(port, () => console.log(`Listening on port ${port}`));