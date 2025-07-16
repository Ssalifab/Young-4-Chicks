const express = require("express");
const router = express.Router();
//app.METHOD(PATH, HANDLER); Structure of a route:
router.get('/', (req, res) => {
  res.send('Homepage! Hello world.')
});

//about
router.get('/about', (req, res) => {
  res.send('About page. Nice.')
});

router.get('/team', (req, res) => {
  res.send('Team page. Great.')
});

router.post('/postabout', (req, res) => {
  res.send('Got a POST request')
});

router.put('/user', (req, res) => {
  res.send('Got a PUT request an /user')
});

router.delete('/user', (req, res) => {
  res.send('Got a DELETE request at /user')
});

//Path Parameters
router.get('/profile/:username', (req, res) => {
  res.send('This is a path parameter ' + req.params.username)
  //get profile from database using the username
});

//Query params
router.get("/queryparams", (req, res) => {
  res.send(
    "My query params are: " + req.query.class + " and " + req.query.cohort
  );
});

//Serving html files
router.get("/kampala", (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

router.get("/namuli", (req, res) => {
  res.sendFile(__dirname + '/blogs.html')
})



module.exports = router;
