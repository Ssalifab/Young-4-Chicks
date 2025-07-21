const express = require('express');
const router = express.Router();
const sale = require("../models/salesDashboardModal");
const stock = require("../models/managerDashboardModal");

//Sales dashboard get route
router.get('/sales', (req,res)=>{
    res.render('salesDashboard');
});

//Sales dashboard post route || this comes to action when submit button is clicked
router.post('/sales', (req,res)=>{
    console.log(req.body);  //req.body symbolizes everything you are picking from the form
    const newSale = new sale(req.body);
    newSale.save();
});


//Management dashboard route
router.get('/management', (req,res)=>{
    res.render('managerDashboard');
});

//Management dashboard post route
router.post('/management', (req,res)=>{
    console.log(req.body);
    const newStock = new stock(req.body);
    newStock.save();
});

module.exports=router;