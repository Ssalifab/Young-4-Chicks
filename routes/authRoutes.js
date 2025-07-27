const express = require('express');
const router = express.Router();
const User = require("../models/signupModal");
const passport = require('passport');

//Signup get route
router.get('/signup', (req, res) => {
    res.render('signup');
});

//Signup post route
router.post('/signup', async (req, res) => {
    try {
        const user = new User(req.body);
        let existingUser = await User.findOne({email: req.body.email});
        if(existingUser){
            return res.status(400).send('Email already exixts on platform');
        } else{
            await User.register(user, req.body.password, (err)=>{
                if (err){
                    throw err;
                }
                res.redirect('/login')
            });
        }
    } catch (error) {
        console.error(error);
        res.status(400).send('Sorry! Something went wrong'); 
    }

});

//Login route
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {failureRedirect:'/login'}), (req, res) => {
    req.session.user = req.user;
    if(req.user.role == 'farmer'){
        res.redirect('/farmer')
    }else if(req.user.role == 'salesRep'){
        res.redirect('/sales')
    }else if(req.user.role == 'brooderManager'){
        res.redirect('/stock')
    }else{
        res.send('You do not have a role in the system');
        res.redirect('/login');
    }    
});

//Logout route
router.get('/logout', (req, res)=>{
    if(req.session){
        req.session.destroy((error)=>{
            if(error){
                return res.status(500).send('Error logging out')
            }
            res.redirect('/index')
        })
    }
})

module.exports = router;