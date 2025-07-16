const express = require('express');
const router = express.Router();

const farmerData = require('../models/FarmerModels');
const User = require('../models/user');

router.get('/addFarmer', (req,res) => {
    res.render('farmerRegistration');
});

// router.get('/login', (req,res) => {
//     res.render('login');
// });

router.post('/addFarmer', async(req, res) => {
    try{
        console.log(req.body);
        const newFarmer = new farmerData(req.body); //Post to DB
        await newFarmer.save();
    }
    catch(error){
        console.error(error);
        res.status(400).render('farmerRegistration');
    }
});

//Login route

//get List of users from the database
router.get("/userlist",async(req,res)=>{
  try {
    let users = await User.find().sort({$natural:-1});
    res.render('usersList', {users});
  } catch (error) {
    res.status(400).send('Unable to retrieve users from the database')
  }
})

module.exports = router;