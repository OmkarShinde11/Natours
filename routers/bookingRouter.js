const express=require('express');
const { verifyUser } = require('../controllers/authController');
const { getCheckoutSession, createBooking } = require('../controllers/bookingController');
const bookingRouter=express.Router();

bookingRouter.route('/checkout/:tourId').get(verifyUser,getCheckoutSession);
bookingRouter.route('/createBooking').post(createBooking,verifyUser)

module.exports=bookingRouter;