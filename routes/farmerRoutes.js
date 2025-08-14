const express = require('express');
const router = express.Router();
const request = require("../models/farmerDashboardModal");
const {ensureAuthenticated, ensureFarmer} = require("../middleware/authMiddleware");
const User = require("../models/signupModal");
const Stock = require("../models/managerDashboardModal");
const Sale = require("../models/salesDashboardModal");
const Feed = require("../models/feedsModal");
const FeedRequest = require("../models/feedsRequestModal");

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
        const availableBreeds = await Stock.aggregate([
            {$match: {breed:{$in:["local", "exotic"]}}},
            {$group: {
                _id: null,
                localStock: {$sum: {$cond: [{$eq: ["$breed", "local"]}, "$quantity", 0]}},
                exoticStock: {$sum: {$cond: [{$eq: ["$breed", "exotic"]}, "$quantity", 0]}}
            }}
        ]);
        const local = availableBreeds[0].localStock || 0;
        const exotic = availableBreeds[0].exoticStock || 0;
        
        console.log("These are my requests so far:", requests);
        res.render('farmerDashboard', {isStarter, users, requests, stock, farmerName, farmerType, availableStock: availableStock[0].totalChickStock || 0, broilers, layers, availableBreeds: availableBreeds[0].totalChickStock || 0, local, exotic});
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

// Get all feed requests for the farmer
router.get('/feedRequest', ensureAuthenticated, ensureFarmer, async (req, res) => {
  try {
    const users = await User.find();
    const farmerName = req.session.user.firstName + " " + req.session.user.lastName;
    const farmerType = req.session.user.farmerType;
    const feedRequests = await FeedRequest.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    console.log("These are my feed requests so far:", feedRequests);
    res.render('feedRequest', {
      farmerName: `${req.user.firstName} ${req.user.lastName}`,
      farmerType: req.user.farmerType,
      feedRequests,
      messages: req.flash()
    });
  } catch (error) {
    console.error('Error fetching feed requests:', error);
    req.flash('error', 'Failed to load feed requests');
    res.redirect('/farmer');
  }
});


// Create new feed request
router.post('/feedRequest', ensureAuthenticated, ensureFarmer, async (req, res) => {
  try {
    const { feedName, feedType, targetAge, brand, qty, unitPrice, dateRequested } = req.body;
    
    // Basic validation
    if (!feedName || !feedType || !targetAge || !brand || !qty || !unitPrice) {
      req.flash('error', 'Please fill all required fields');
      return res.redirect('/feedRequest');
    }

    const newRequest = new FeedRequest({
      user: req.user._id,
      feedName,
      feedType,
      targetAge,
      brand,
      qty: parseInt(qty),
      unitPrice: parseFloat(unitPrice),
      expiryDate: new Date(new Date(dateRequested).setFullYear(new Date(dateRequested).getFullYear() + 1)),
      dateRequested
    });

    await newRequest.save();
    
    req.flash('success', 'Feed request submitted successfully');
    res.redirect('/feedRequest');
    
  } catch (error) {
    console.error('Error creating feed request:', error);
    req.flash('error', 'Failed to submit feed request. Please try again.');
    res.redirect('/feedRequest');
  }
});

module.exports = router;