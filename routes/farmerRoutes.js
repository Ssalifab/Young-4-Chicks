const express = require('express');
const router = express.Router();
const request = require("../models/farmerDashboardModal");
const {ensureAuthenticated, ensureFarmer} = require("../middleware/authMiddleware");
const User = require("../models/signupModal");
const Stock = require("../models/managerDashboardModal");

//Farmer dashboard get route
router.get('/farmer', ensureAuthenticated, ensureFarmer, async(req, res) => {
    try {
        const users = await User.find();
        const stock = await Stock.find();
        const requests = await request.find({user:req.session.user._id});
        const isStarter = requests.length === 0;
        const farmerName = req.session.user.firstName + " " + req.session.user.lastName;
        const farmerType = req.session.user.farmerType;
        const availableStock = await Stock.aggregate([
            {$match: {chickType:{$in:["broiler", "layer"]}}},

            {$group: {
                _id: null,
                broilerStock: {$sum: {$cond: [{$eq: ["$chickType", "broiler"]}, "$quantity", 0]}},
                layerStock: {$sum: {$cond: [{$eq: ["$chickType", "layer"]}, "$quantity", 0]}}
        }}
        ]);
        const broilers = availableStock[0].broilerStock || 0;
        const layers = availableStock[0].layerStock || 0;
        console.log("These are my requests so far:", requests);
        res.render('farmerDashboard', {isStarter, users, requests, stock, farmerName, farmerType, availableStock: availableStock[0].totalChickStock || 0, broilers, layers});
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