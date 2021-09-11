const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {signup, signin} = require('../controllers/auth');
const {validateSignupRequest, validateSigninRequest, isRequestValidated} = require('../validators/auth');
const {requireSignin} = require('../common-middleware/index');

router.post('/signup', validateSignupRequest, isRequestValidated, signup);
router.post('/signin',validateSigninRequest, isRequestValidated, signin);

router.post('/profile', requireSignin, (req, res)=>{
  return res.status(200).json({user: 'profile'});
})

module.exports = router;