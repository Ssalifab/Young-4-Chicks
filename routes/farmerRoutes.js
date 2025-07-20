const express = require('express');
const router = express.Router();

//Farmer dashboard route
router.get('/farmer', (req,res)=>{
    res.render('farmerDashboard');
});

module.exports=router;