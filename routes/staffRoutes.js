const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureManager, ensureSalesRep } = require('../middleware/authMiddleware');
const Sale = require("../models/salesDashboardModal");
const Stock = require("../models/managerDashboardModal");
const Feed = require("../models/feedsModal");
const User = require("../models/signupModal");
const Requests = require("../models/salesDashboardModal");

//Sales Rep Routes
//Sales dashboard get route|| Sales Rep
// router.get('/sales', ensureAuthenticated, ensureSalesRep, async (req, res) => {
//     try {
//         if (!req.user) {
//             return res.redirect('/login');
//         }
//         const loggedInUser = {
//             id: req.user._id,
//             name: `${req.user.firstName} ${req.user.lastName}`,
//             email: req.user.email,
//             role: req.user.role
//         };
//         const totalRequests = await Requests.countDocuments({})
//         const pendingRequests = await Requests.countDocuments({ status: 'pending' })
//         const approvedRequests = await Requests.countDocuments({ status: 'approved' })
//         const dispatchedRequests = await Requests.countDocuments({ status: 'dispatched' })
//         const canceledRequests = await Requests.countDocuments({ status: 'canceled' })
//         const users = await User.find();
//         const farmers = await User.find({ role: 'farmer' }).select('firstName lastName nin').lean() || [];
//         const requests = await Requests.find().populate({
//             path: 'user farmer',  // Populate both user and farmer references
//             select: 'firstName lastName'  // Only get these fields
//         })
//             .sort({ dateUpdated: -1 })  // Newest first
//             .lean() || [];
//         const isStarter = requests.length === 0;


//         const chickSales = await Requests.aggregate([
//             { $match: { status: { $in: ['approved', 'dispatched'] } } },
//             {
//                 $group: {
//                     _id: null, totalQuantity: { $sum: '$quantity' },
//                     totalChickSales: { $sum: { $multiply: ['$quantity', 1650] } }
//                 }
//             }
//         ]).catch(() => [{ totalQuantity: 0, totalChickSales: 0 }]); // Fallback if aggregation fails

//         res.render('salesDashboard', {
//             currentUser: loggedInUser,
//             users,
//             farmers: farmers || [],
//             isStarter: true,
//             requests: requests || [],
//             chickSales: chickSales[0],
//             pendingRequests,
//             approvedRequests,
//             dispatchedRequests,
//             canceledRequests,
//             totalRequests,
//         });

//     } catch (error) {
//         console.error(err);
//         res.status(500).render('salesDashboard', {
//             farmers: [], requests: []
//         });
//     }
// });

router.get('/sales', ensureAuthenticated, ensureSalesRep, async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect('/login');
        }

        // User data
        const loggedInUser = {
            id: req.user._id,
            name: `${req.user.firstName} ${req.user.lastName}`,
            email: req.user.email,
            role: req.user.role
        };

        // Counts
        const [
            totalRequests,
            pendingRequests,
            approvedRequests,
            dispatchedRequests,
            canceledRequests,
            users,
            farmers,
            requests,
            chickSales
        ] = await Promise.all([
            Requests.countDocuments({}),
            Requests.countDocuments({ status: 'pending' }),
            Requests.countDocuments({ status: 'approved' }),
            Requests.countDocuments({ status: 'dispatched' }),
            Requests.countDocuments({ status: 'canceled' }),
            User.find().lean(),
            User.find({ role: 'farmer' }).select('firstName lastName nin').lean(),
            Requests.find()
                .populate([
                    {
                        path: 'user',
                        select: 'firstName lastName',
                        model: 'User'
                    },
                    {
                        path: 'farmer',
                        select: 'firstName lastName',
                        model: 'User'
                    }
                ])
                .sort({ dateUpdated: -1 })
                .lean(),
            Requests.aggregate([
                { $match: { status: { $in: ['approved', 'dispatched'] } } },
                {
                    $group: {
                        _id: null,
                        totalQuantity: { $sum: '$quantity' },
                        totalChickSales: { $sum: { $multiply: ['$quantity', 1650] } }
                    }
                }
            ]).catch(() => [{ totalQuantity: 0, totalChickSales: 0 }])
        ]);

        res.render('salesDashboard', {
            currentUser: loggedInUser,
            users: users || [],
            farmers: farmers || [],
            isStarter: requests.length === 0,
            requests: requests || [],
            chickSales: chickSales[0] || { totalQuantity: 0, totalChickSales: 0 },
            pendingRequests: pendingRequests || 0,
            approvedRequests: approvedRequests || 0,
            dispatchedRequests: dispatchedRequests || 0,
            canceledRequests: canceledRequests || 0,
            totalRequests: totalRequests || 0,
            moment: require('moment') // Add moment for date formatting
        });

    } catch (error) {
        console.error('Error in /sales route:', error);
        res.status(500).render('salesDashboard', {
            currentUser: req.user || {},
            farmers: [],
            requests: [],
            error: 'Failed to load dashboard data'
        });
    }
});

//Sales dashboard post route || this comes to action when submit button is clicked || Sales Rep
router.post('/sales', ensureAuthenticated, ensureSalesRep, async (req, res) => {
    try {
        console.log(req.body);  //req.body symbolizes everything you are picking from the form

        const farmerType = req.body.farmerType;
        if (!['starter', 'returning'].includes(farmerType)) {
            throw new Error('Invalid farmer type');
        }
        const maxQuantity = farmerType === 'starter' ? 100 : 500;
        const quantity = Math.min(parseInt(req.body.quantity) || 0, maxQuantity);

        const { farmerId, farmerName, type, breed } = req.body;

        // Validate required fields
        if (!farmerId || !type || !breed || !farmerType || !quantity) {
            const farmers = await User.find({ role: 'farmer' }).lean();
            return res.status(400).render('salesDashboard', {
                error: 'All fields are required',
                currentUser: req.user,
                farmers: farmers || []
            });
        }
        // Verify farmer exists
        const farmer = await User.findById(farmerId);
        if (!farmer) {
            return res.status(404).render('salesDashboard', {
                error: 'Farmer not found',
                currentUser: req.user
            });
        }
        // Validate quantity based on farmer type

        if (quantity > maxQuantity) {
            return res.status(400).render('salesDashboard', {
                error: `Quantity exceeds maximum allowed (${maxQuantity})`,
                currentUser: req.user
            });
        }

        // 5. Date handling - either from form or current date
        let dateValue;
        if (Array.isArray(req.body.dateUpdated)) {
            dateValue = req.body.dateUpdated[0] || new Date();
        } else {
            dateValue = req.body.dateUpdated || new Date();
        }
        const dateUpdated = new Date(dateValue);
        if (isNaN(dateUpdated.getTime())) {
            throw new Error('Invalid date format');
        }

        // 5. Create and save the sale
        const saleData = {
            farmer: farmerId,
            user: req.user._id,
            submittedBy: req.user._id,
            type,
            breed,
            farmerType,
            quantity,
            dateUpdated,
            status: 'pending'
        };

        console.log('Saving sale:', saleData); // Debug log

        const newSale = new Sale(saleData);
        const savedSale = await newSale.save();
        console.log('Sale saved:', savedSale); // Debug log

        res.redirect('/sales');

    } catch (error) {
        console.error('Submission failed:', error.message);

        const farmers = await User.find({ role: 'farmer' }).lean();
        res.status(400).render('salesDashboard', {
            error: error.message,
            currentUser: req.user,
            farmers: farmers || [],
            submittedData: req.body
            // Create new sale
            //     const newSale = new Sale({
            //         farmer: farmerId,
            //         user: req.user._id,  // Add the authenticated user
            //         submittedBy: req.user._id, //sales rep ID from session
            //         farmerName,
            //         type,
            //         breed,
            //         farmerType,
            //         quantity: Number(quantity),
            //         dateUpdated,
            //         status: 'pending' // Default status
            //     });
            //     console.log('Saving sale:', saleData); // Debug log

            //     await newSale.save();
            //     req.flash('success', 'Sale request submitted successfully');
            //     return res.redirect('/sales');

            // } catch (error) {
            //     console.error('Submission error:', error);
            //     // Get fresh farmer list for the form
            //     const farmers = await User.find({ role: 'farmer' }).lean();
            //     return res.status(500).render('salesDashboard', {
            //         error: error.message || 'Failed to process request',
            //         currentUser: req.user,
            //         farmers: farmers || [],
            //         // Pass submitted data back to maintain form state
            //         submittedData: req.body
        });
    }

});

//List of sales in Database
router.get('/salesList', async (req, res) => {
    try {
        let sales = await Sale.find().sort({ $natural: -1 });
        res.render('salesList', { sales })
    } catch (error) {
        res.status(400).send('Unable to retrieve sales from database')
    }
})

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
router.get('/feeds', (req, res) => {
    res.render('managerDashboard');
});

//Management dashboard post route
router.post('/feeds', async (req, res) => {
    try {
        console.log(req.body);
        const newFeed = new feed(req.body);
        await newFeed.save();
    } catch (error) {
        console.error(error);
        res.status(400).render('managerDashboard');
        // res.status(400).send('Unable to send data to the Database');
    }

});

//List of feeds in Database
router.get('/feedsList', async (req, res) => {
    try {
        let feeds = await feed.find().sort({ $natural: -1 });
        res.render('feedList', { feeds })
    } catch (error) {
        res.status(400).send('Unable to retrieve feeds from database')
    }
});

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