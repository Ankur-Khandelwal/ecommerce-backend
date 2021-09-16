const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const {signup, signin, signout} = require('../../controllers/admin/auth');
const {validateSignupRequest, validateSigninRequest, isRequestValidated} = require('../../validators/auth');
const {requireSignin} = require('../../common-middleware');


router.post('/admin/signup', validateSignupRequest, isRequestValidated, signup);
router.post('/admin/signin',validateSigninRequest, isRequestValidated, signin);
router.post('/admin/signout', requireSignin, signout);

// router.post('/profile', requireSignin, (req, res)=>{
//   return res.status(200).json({user: 'profile'});
// })

module.exports = router;