const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureManager, ensureSalesRep } = require('../middleware/authMiddleware');
const Sale = require("../models/salesDashboardModal");
const Stock = require("../models/managerDashboardModal");
const Feed = require("../models/feedsModal");
const User = require("../models/signupModal");
const Requests = require("../models/farmerDashboardModal");

//Sales Rep Routes
//Sales dashboard get route|| Sales Rep
router.get('/sales', ensureAuthenticated,ensureSalesRep, async (req, res) => {
    //Get logged-in user details from session
        const loggedInUser = {
            id: req.user._id,
            name: req.user.firstName + " " + req.user.lastName,
            email: req.user.email,
            role: req.user.role
        };
        const totalRequests = await Requests.countDocuments({});
        const pendingRequests = await Requests.countDocuments({ status: 'pending' });
        const approvedRequests = await Requests.countDocuments({ status: 'approved' });
        const dispatchedRequests = await Requests.countDocuments({ status: 'dispatched' });
        const rejectedRequests = await Requests.countDocuments({ status: 'rejected' });
        const users = await User.find();
        const sales = await Sale.find().populate('user');
        const farmers = await User.find({ role: 'farmer' }).select('firstName lastName nin');
        const stock = await Stock.find();
        const requests = await Requests.find().populate("user", "firstName lastName");
        const chickSales = await Requests.aggregate([
            { $match: { status: { $in: ['approved', 'dispatched'] } } },
            {
                $group: {
                    _id: null, totalQuantity: { $sum: '$quantity' },
                    totalChickSales: { $sum: { $multiply: ['$quantity', 1650] } }
                }
            }
        ])
    res.render('salesDashboard',{
        currentUser: loggedInUser,
        user: req.user,
        totalRequests,
        pendingRequests,
        approvedRequests,
        dispatchedRequests,
        rejectedRequests,
        users,
        farmers,
        sales,
        stock,
        requests,
        chickSales: chickSales[0]
    });
});

//Sales dashboard post route || this comes to action when submit button is clicked || Sales Rep
router.post('/sales', ensureAuthenticated, ensureSalesRep, async (req, res) => {
    try { 
        console.log(req.body);  //req.body symbolizes everything you are picking from the form
        const newSale = new Sale({...req.body,  user: req.user._id, dateUpdated: new Date()}); 
        await newSale.save();
    } catch (error) {
        console.error(error);
        res.status(400).render('salesDashboard'); //pass the pug file as a parameter
    }
});


//List of sales in Database
router.get('/salesList', async (req, res) => {
    try {
        const users = await User.find();
        const farmers = await User.find({ role: 'farmer' });
        let sales = await Sale.find().sort({ $natural: -1 }).populate({path:'farmer', select:'firstName lastName nin', model:'User'});
        res.render('salesList', { sales, helpers: {
                getFarmerName: (farmer) => {
                    return farmer ? `${farmer.firstName} ${farmer.lastName}` : 'Unknown Farmer';
                }, users }});
    } catch (error) {
        console.error('Error fetching sales:', error);
        res.status(400).send('Unable to retrieve sales from database')
    }
})
// router.get('/salesList', async (req, res) => {
//     try {
//         const sales = await Sale.find()
//             .sort({ $natural: -1 })
//             .populate({
//                 path: 'user',
//                 select: 'firstName lastName'
//             })
//             .populate({
//                 path: 'farmer',
//                 select: 'firstName lastName nin role',
//                 match: { role: 'farmer' } // Ensure only farmers are populated
//             });

//         // Get distinct lists if needed elsewhere in your template
//         const users = await User.find().select('firstName lastName');
//         const farmers = await User.find({ role: 'farmer' }).select('firstName lastName nin');

//         res.render('salesList', { 
//             sales,
//             farmers,
//             users,
//             helpers: {
//                 getFarmerName: (farmer) => {
//                     return farmer ? `${farmer.firstName} ${farmer.lastName}` : 'Unknown Farmer';
//                 }
//             }
//         });
//     } catch (error) {
//         console.error('Sales list error:', error);
//         res.status(500).render('error', { message: 'Failed to load sales data' });
//     }
// });

//Updating sales get route

router.get("/updateSales/:id", async (req, res) => {
    try {
        const updateSales = await Sale.findOne({ _id: req.params.id })
        res.render('update-sales', { sale: updateSales });
    } catch (error) {
        res.status(400).send('Unable to retrieve sales from the database');
        console.log(error);
    }
});

//Update sales post route
router.post("/updateSales/:id", async (req, res) => {
    try {
        await Sale.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/salesList');
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
});

//Delete sale 
router.post('/deleteSale', async (req, res) => {
    try {
        await Sale.deleteOne({ _id: req.body.id })
        res.redirect('/salesList');
    } catch (error) {
        res.status(400).send("Error: " + error.message);
        console.log(error.message);
    }
})


//Manager Dashboard routes
//Stock Management dashboard routes
router.get('/stock', ensureAuthenticated, ensureManager, async (req, res) => {
    try {
        // Get logged-in user details from session
        const loggedInUser = {
            id: req.user._id,
            name: `${req.user.firstName} ${req.user.lastName}`,
            email: req.user.email,
            role: req.user.role
        };
        const totalRequests = await Requests.countDocuments({})
        const pendingRequests = await Requests.countDocuments({ status: 'pending' })
        const approvedRequests = await Requests.countDocuments({ status: 'approved' })
        const dispatchedRequests = await Requests.countDocuments({ status: 'dispatched' })
        const canceledRequests = await Requests.countDocuments({ status: 'canceled' })
        const users = await User.find();
        const feeds = await Feed.find();
        const farmers = await User.find({ role: 'farmer' });
        const stock = await Stock.find();
        const requests = await Requests.find().populate("user", "firstName lastName")
        const [totalStock] = await Stock.aggregate([
            { $group: { _id: null, totalChickStock: { $sum: '$quantity' } } }
        ]) || [{}];


        const chickSales = await Requests.aggregate([
            { $match: { status: { $in: ['approved', 'dispatched'] } } },
            {
                $group: {
                    _id: null, totalQuantity: { $sum: '$quantity' },
                    totalChickSales: { $sum: { $multiply: ['$quantity', 1650] } }
                }
            }
        ])
        res.render('managerDashboard', {
            currentUser: loggedInUser,
            users,
            feeds,
            farmers,
            stock,
            requests,
            chickSales: chickSales[0],
            pendingRequests,
            approvedRequests,
            dispatchedRequests,
            canceledRequests,
            totalRequests,
            totalChickStock: totalStock.totalChickStock || 0
        });
    } catch (error) {
        res.status(500).send('Error loading dashboard data');
    }
});

//Stock Management dashboard post route
router.post('/stock', async (req, res) => {
    try {
        console.log(req.body);
        const newStock = new Stock(req.body);
        await newStock.save();
    } catch (error) {
        console.error(error);
        res.status(400).render('managerDashboard');
        // res.status(400).send('Unable to send data to the Database');
    }

});

//List of stock in Database
router.get('/stockList', async (req, res) => {
    try {
        let stocks = await Stock.find().sort({ $natural: -1 });
        res.render('stockList', { stocks })
    } catch (error) {
        res.status(400).send('Unable to retrieve stock from database')
    }
});

//Updating stock get route

router.get("/updateStock/:id", async (req, res) => {
    try {
        const updateStock = await Stock.findOne({ _id: req.params.id })
        res.render('update-stock', { stock: updateStock });
    } catch (error) {
        res.status(400).send('Unable to find stock in the database');
        console.log(error);
    }
});

//Update stock post route
router.post("/updateStock/:id", async (req, res) => {
    try {
        await Stock.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/stockList');
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
});

//Delete stock 
router.post('/deleteStock', async (req, res) => {
    try {
        await Stock.deleteOne({ _id: req.body.id })
        res.redirect('/stockList');
    } catch (error) {
        res.status(400).send("Error: " + error.message);
        console.log(error.message);
    }
})






//Feeds on Management dashboard routes
router.get('/feeds', ensureAuthenticated, ensureManager, async (req, res) => {
    console.log('Attempting to render feedsDashboard');
    res.render('feedsDashboard');
});

//Management dashboard post route
router.post('/feeds', async (req, res) => {
    try {
        console.log(req.body);
        const newFeed = new Feed(req.body);
        await newFeed.save();
    } catch (error) {
        console.error(error);
        res.status(400).render('feedsDashboard');
        // res.status(400).send('Unable to send data to the Database');
    }

});

//List of feeds in Database
router.get('/feedsList', async (req, res) => {
    try {
        let feeds = await Feed.find().sort({ $natural: -1 });
        res.render('feedsDashboard', { feeds })
    } catch (error) {
        res.status(400).send('Unable to retrieve feeds from database')
    }
});

//Update feed get route

router.get("/updateFeed/:id", async (req, res) => {
    try {
        const updateFeed = await Feed.findOne({ _id: req.params.id })
        res.render('update-feed', { feed: updateFeed });
    } catch (error) {
        res.status(400).send('Unable to find feed in the database');
        console.log(error);
    }
});

//Update feed post route
router.post("/updateFeed/:id", async (req, res) => {
    try {
        await Feed.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/feedsList');
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
});

//Delete feed 
router.post('/deleteFeed', async (req, res) => {
    try {
        await Feed.deleteOne({ _id: req.body.id })
        res.redirect('/feedsList');
    } catch (error) {
        res.status(400).send("Error: " + error.message);
        console.log(error.message);
    }
})

//Get List of all Users from the database
router.get('/userlist', ensureAuthenticated, ensureManager, async (req, res) => {
    try {
        let users = await User.find().sort({ $natural: -1 }).limit(20);
        res.render('userlist', { users })
    } catch (error) {
        res.status(400).send('Unable to find requested users')
    }
})

//Updating User get route

router.get("/updateUser/:id", async (req, res) => {
    try {
        const updateUser = await User.findOne({ _id: req.params.id })
        res.render('update-user', { user: updateUser });
    } catch (error) {
        res.status(400).send('Unable to find User in the database');
        console.log(error);
    }
});

//Update User post route
router.post("/updateUser/:id", async (req, res) => {
    
    try {
        await User.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/userlist');
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
});

//Delete User 
router.post('/deleteUser', async (req, res) => {
    try {
        await User.deleteOne({ _id: req.body.id })
        res.redirect('/userlist');
    } catch (error) {
        res.status(400).send("Error: " + error.message);
        console.log(error.message);
    }
})


module.exports = router;