const express = require('express');
const router = express.Router();
const user = require("../models/signupModal");

//Signup get route
router.get('/signup', (req,res)=>{
    res.render('signup');
});

//Signup post route
router.post('/signup', (req,res)=>{
    console.log(req.body);
    const newUser = new user(req.body);
    newUser.save();
});

//Login route
router.get('/login', (req,res)=>{
    res.render('login');
});

module.exports=router;