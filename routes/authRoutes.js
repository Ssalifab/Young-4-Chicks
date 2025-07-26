const express = require('express');
const router = express.Router();
const user = require("../models/signupModal");

//Signup get route
router.get('/signup', (req, res) => {
    res.render('signup');
});

//Signup post route
router.post('/signup', async (req, res) => {
    try {
        console.log(req.body);
        const newUser = new user(req.body);
        await newUser.save();
    } catch (error) {
        console.error(error);
        res.status(400).render('signup'); //pass the pug file as a parameter
    }

});

//Login route
router.get('/login', (req, res) => {
    res.render('login');
});

module.exports = router;