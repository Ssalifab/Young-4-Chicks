const express = require('express');
const router = express.Router();
const{ensureAuthenticated, ensureManager}= require('../middleware/authMiddleware');
const sale = require("../models/salesDashboardModal");
const stock = require("../models/managerDashboardModal");
const feed = require("../models/feedsModal");
const User = require("../models/signupModal");

//Sales dashboard get route
router.get('/sales', (req, res) => {
    res.render('salesDashboard');
});

//Sales dashboard post route || this comes to action when submit button is clicked
router.post('/sales', async (req, res) => {
    try {
        console.log(req.body);  //req.body symbolizes everything you are picking from the form
        const newSale = new sale(req.body);
        await newSale.save();
    } catch (error) {
        console.error(error);
        res.status(400).render('sales'); //pass the pug file as a parameter
    }

});


//Stock Management dashboard routes
router.get('/stock', (req, res) => {
    res.render('managerDashboard');
});

//Stock Management dashboard post route
router.post('/stock', async (req, res) => {
    try {
        console.log(req.body);
        const newStock = new stock(req.body);
        await newStock.save();
    } catch (error) {
        console.error(error);
        res.status(400).render('managerDashboard');
        // res.status(400).send('Unable to send data to the Database');
    }

});

//Feeds on Management dashboard routes
router.get('/feeds', (req, res) => {
    res.render('managerDashboard');
});

//Management dashboard post route
router.post('/feeds', async (req, res) => {
    try {
        console.log(req.body);
        const newFeed = new feed(req.body);
        await newFeed.save();
    } catch (error) {
        console.error(error);
        res.status(400).render('managerDashboard');
        // res.status(400).send('Unable to send data to the Database');
    }

});

//Get List of all Users from the database
router.get('/userlist', ensureAuthenticated, ensureManager, async(req,res)=>{
try {
    let users = await User.find().sort({$natural:-1}).limit(20);
    res.render('userlist',{users})
} catch (error) {
    res.status(400).send('Unable to find requested users')
}
})

//Updating User get route

router.get("/updateUser/:id", async (req,res)=>{
    try {
        const updateUser = await User.findOne({_id:req.params.id})
        res.render('update-user', {user: updateUser});
    } catch (error) {
        res.status(400).send('Unable to find User in the database');
        console.log(error);
    }
});

//Update User post route
router.post("/updateUser/:id", async (req, res) => {  
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/userlist');
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

//Delete User 
router.post('/deleteUser', async(req,res)=>{
    try {
        await User.deleteOne({_id:req.body.id})
        res.redirect('/userlist');
    } catch (error) {
        res.status(400).send("Error: " + error.message);
        console.log(error.message);
    }
})


module.exports = router;