const express = require('express');
const router = express.Router();
const request = require("../models/farmerDashboardModal");

//Farmer dashboard get route
router.get('/farmer', (req, res) => {
    res.render('farmerDashboard');
});

router.post('/farmer', async (req, res) => {
    try {
        console.log(req.body);  //req.body symbolizes everything you are picking from the form
        const newRequest = new request(req.body);
        await newRequest.save();
    } catch (error) {
        console.error(error);
        res.status(400).render('farmerDashboard'); //pass the pug file as a parameter
    }

});

module.exports = router;