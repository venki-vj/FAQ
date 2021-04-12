const express = require('express');
const router = express.Router();
// const User=require('../models/user');
const user=require('../controllers/user')
const catchAsync=require('../utils/catchAsync')
const passport=require('passport');

router.route('/register')
    .get(user.get)
    .post(catchAsync(user.register));

router.route('/login')
    .get(user.getLogin)
    .post(passport.authenticate('local',{failureFlash:true,failureRedirect:true}),user.postLogin);

router.get('/logout',user.logout)

module.exports=router;