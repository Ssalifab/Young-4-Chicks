const express = require('express');
const router = express.Router();

const salesData = require('../models/SalesModels');

router.get('/addSales', (req, res) => {
    res.render('salesDashboard')
})

router.post('/addSales', async (req, res) => {
    try{
        console.log(req.body);
        const newSale = new salesData(req.body);
        await newSale.save();
    }
    catch(error){
        console.error(error);
        res.status(400).render('salesDashboard');
    }
});


module.exports = router;