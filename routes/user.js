const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");

const jwt = require('jsonwebtoken');

// // Signup Router =>
router
.route("/signup")
.get( userController.renderSignupForm)
.post(wrapAsync(userController.signup ));


// // Login Router =>
router
.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", {
  failureRedirect:"/login",
  failureFlash: true
}), userController.login);


// // Logout Router =>
router.get("/logout", userController.logout);


// // Guest Registration
// router.post('/register/guest', async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: 'Username and password are required.' });
//   }

//   const user = new User({ username, password, role: 'guest' });

//   try {
//     await user.save();
//     res.status(201).json({ message: 'Guest registered successfully!' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error registering guest.', error });
//   }
// });

// // Host Registration
// router.post('/register/host', async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: 'Username and password are required.' });
//   }

//   const user = new User({ username, password, role: 'host' });

//   try {
//     await user.save();
//     res.status(201).json({ message: 'Host registered successfully!' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error registering host.', error });
//   }
// });

// //  Implement Login Routes

// router.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: 'Username and password are required.' });
//   }

//   try {
//     const user = await User.findOne({ username });

//     if (!user || user.password !== password) {
//       return res.status(401).json({ message: 'Invalid username or password.' });
//     }

//     const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });

//     res.json({ token });
//   } catch (error) {
//     res.status(500).json({ message: 'Login error.', error });
//   }
// });


module.exports = router;