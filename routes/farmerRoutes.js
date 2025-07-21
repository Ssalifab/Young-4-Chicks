const express = require('express');
const router = express.Router();
const request = require("../models/farmerDashboardModal");

//Farmer dashboard get route
router.get('/farmer', (req,res)=>{
    res.render('farmerDashboard');
});

router.post('/farmer', (req,res)=>{
    console.log(req.body);  //req.body symbolizes everything you are picking from the form
    const newRequest = new request(req.body);
    newRequest.save();
});

module.exports=router;