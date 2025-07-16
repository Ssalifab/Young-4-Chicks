const express = require('express');
const router = express.Router();

const chickStock = require('../models/ChicksModels');

router.get('/addChicks', (req, res) => {
    res.render('chickRegistration');
});

router.post('/addChicks', async (req, res) => {
    try {
        console.log(req.body);  //Posts to the console
        const newStock = new chickStock(req.body); //Post the data to database
        await newStock.save();
    }
    catch (error) {
        console.error(error);
        res.status(400).render('chickRegistration');
    }
});

//This should always be the last line in routes file
module.exports = router;