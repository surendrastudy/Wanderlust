const express = require('express');
const router = express.Router();
const wrapAsyc = require('../utils/wrapAsyc');
const passport = require('passport');
const { savRedirectUrl, isLoggedIn } = require('../middleware');
const userController=require('../controllers/user');

router.route('/signup')
.get(userController.renderSignupForm)
.post(wrapAsyc(userController.signup));

router.route('/login')
.get(userController.renderLoginForm)
.post(savRedirectUrl,
    passport.authenticate('local',{
    failureRedirect: '/login',failureFlash:true 
    }),
    userController.login );

router.get('/logout',userController.logout)

module.exports=router;