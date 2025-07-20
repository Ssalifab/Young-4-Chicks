const express = require('express');
const router = express.Router();

//Sales dashboard route
router.get('/sales', (req,res)=>{
    res.render('salesDashboard');
});

//Management dashboard route
router.get('/management', (req,res)=>{
    res.render('managerDashboard');
});


module.exports=router;