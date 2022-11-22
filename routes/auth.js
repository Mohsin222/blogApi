const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth');
const user = require('../models/user');


router.put('/signup',[
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom( (value ,{req}) =>{
        return user.findOne({email:value})
        .then(userDoc =>{
            if(userDoc){
                return Promise.reject('Email address already exist')
            }
        })
    })
    .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty()
],
authController.singUp
)

router.post('/login',authController.login)


router.get('/allusers',authController.getAllusers)

router.get('/:userId',authController.getSingleusers)

module.exports = router;