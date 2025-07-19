const express = require("express");
const router =express.Router();


router.get('/about', (req,res)=>{
    res.send("My about my page?")
});
router.post('/postabout', (req,res)=>{
    res.send('Got a POST request')
});
router.put('/user', (req,res)=>{
    res.send('Got a PUT request at /user')
});

//Feeds Route
router.get("/feeds", (req,res)=>{
    res.send(__dirname+"/feeds.html");
});

//Payment routes
router.get("/payments", (req,res)=>{
    res.send(__dirname + "/payments.html")
});

module.exports = router;  //Exporting endpoint to be used elsewhere