const express = require('express');
const router = express.Router();
const request = require("../models/farmerDashboardModal");
const {ensureAuthenticated, ensureFarmer} = require("../middleware/authMiddleware")

//Farmer dashboard get route
router.get('/farmer', ensureAuthenticated, ensureFarmer, async(req, res) => {
    try {
        const requests = await request.find({user:req.session.user._id});
        const isStarter = requests.length === 0;
        console.log("These are my requests so far:", requests);
        res.render('farmerDashboard', {isStarter})
    } catch (error) {
        console.error(error.message);
        res.redirect('/farmer')
    }
});

router.post('/farmer', async (req, res) => {
    try {
        console.log(req.body);  //req.body symbolizes everything you are picking from the form
        const {farmerType, chickType, breed, quantity, unitPrice, totalPrice, dateUpdated} = req.body;
        const userId = req.session.user._id;
        const newRequest = new request({
            farmerType, chickType, breed, quantity, unitPrice, totalPrice, dateUpdated,
            user: userId
        })
        await newRequest.save();
    } catch (error) {
        console.error(error);
        res.status(400).render('farmerDashboard'); //pass the pug file as a parameter
    }

   



});

module.exports = router;