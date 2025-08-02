const express = require('express');
const router = express.Router();
const{ensureAuthenticated, ensureManager}= require('../middleware/authMiddleware');
const Sale = require("../models/salesDashboardModal");
const Stock = require("../models/managerDashboardModal");
const Feed = require("../models/feedsModal");
const User = require("../models/signupModal");

//Sales Rep Routes
//Sales dashboard get route|| Sales Rep
router.get('/sales', (req, res) => {
    res.render('salesDashboard');
});

//Sales dashboard post route || this comes to action when submit button is clicked || Sales Rep
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

//List of sales in Database
router.get('/salesList', async(req,res)=>{
    try {
        let sales = await Sale.find().sort({$natural:-1});
        res.render('salesList', {sales})
    } catch (error) {
        res.status(400).send('Unable to retrieve sales from database')
    }
})

//Updating sales get route

router.get("/updateSales/:id", async (req,res)=>{
    try {
        const updateSales = await Sale.findOne({_id:req.params.id})
        res.render('update-sales', {sale: updateSales});
    } catch (error) {
        res.status(400).send('Unable to retrieve sales from the database');
        console.log(error);
    }
});

//Update sales post route
router.post("/updateSales/:id", async (req, res) => {  
  try {
    await Sale.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/salesList');
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

//Delete sale 
router.post('/deleteSale', async(req,res)=>{
    try {
        await Sale.deleteOne({_id:req.body.id})
        res.redirect('/salesList');
    } catch (error) {
        res.status(400).send("Error: " + error.message);
        console.log(error.message);
    }
})


//Manager Dashboard routes
//Stock Management dashboard routes
router.get('/stock', (req, res) => {
    res.render('managerDashboard');
});

//Stock Management dashboard post route
router.post('/stock', async (req, res) => {
    try {
        console.log(req.body);
        const newStock = new Stock(req.body);
        await newStock.save();
    } catch (error) {
        console.error(error);
        res.status(400).render('managerDashboard');
        // res.status(400).send('Unable to send data to the Database');
    }

});

//List of stock in Database
router.get('/stockList', async(req,res)=>{
    try {
        let stocks = await Stock.find().sort({$natural:-1});
        res.render('stockList', {stocks})
    } catch (error) {
        res.status(400).send('Unable to retrieve stock from database')
    }
});

//Updating stock get route

router.get("/updateStock/:id", async (req,res)=>{
    try {
        const updateStock = await Stock.findOne({_id:req.params.id})
        res.render('update-stock', {stock: updateStock});
    } catch (error) {
        res.status(400).send('Unable to find stock in the database');
        console.log(error);
    }
});

//Update stock post route
router.post("/updateStock/:id", async (req, res) => {  
  try {
    await Stock.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/stockList');
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

//Delete stock 
router.post('/deleteStock', async(req,res)=>{
    try {
        await Stock.deleteOne({_id:req.body.id})
        res.redirect('/stockList');
    } catch (error) {
        res.status(400).send("Error: " + error.message);
        console.log(error.message);
    }
})






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

//List of feeds in Database
router.get('/feedsList', async(req,res)=>{
    try {
        let feeds = await feed.find().sort({$natural:-1});
        res.render('feedList', {feeds})
    } catch (error) {
        res.status(400).send('Unable to retrieve feeds from database')
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