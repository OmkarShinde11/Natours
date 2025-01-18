const Tour = require("../Models/tourModel");
const catchAsync = require("../utilities/catchAsync");
const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking=require('../Models/booking');
const getCheckoutSession=catchAsync(async (req,res,next)=>{
    // get an tour bases on req.params.id
    const tour=await Tour.findById(req.params.tourId);

    // create a session
    const session=await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        success_url:`http://localhost:9000/api/v1/booking/createBooking?tour=${tour.id}&user=${req.user.id}&price=${tour.price}`,
        cancel_url:`http://localhost:4200/tours/${req.params.tourId}`,
        customer_email:req.user.email,
        mode: 'payment',
        client_reference_id:req.params.tourId,
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        images: ['https://www.natours.dev/img/tours/tour-1-cover.jpg'],
                    },
                    unit_amount: tour.price * 100, // Convert price to cents
                },
                quantity: 1,
            }
        ]
    });

    //send a res to user
    res.status(200).json({
        status:'Success',
        session,
    })
});


const createBooking=catchAsync(async(req,res,next)=>{
    const {tour,user,price}=req.query;
    if(!tour && !user && !price){
        next();
    }
    await Booking.create({tour,user,price});
    res.redirect(`http://localhost:4200/tours`);
});

module.exports={
    getCheckoutSession,
    createBooking
}