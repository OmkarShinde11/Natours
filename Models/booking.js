const mongoose=require('mongoose');

const bookingSchema=new mongoose.Schema({
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,'tour is required for booking']
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'user is required for booking']
    },
    price:{
        type:Number,
        required:[true,'Price is required to book a tour']
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    paid:{
        type:Boolean,
        default:true,
    }
});

bookingSchema.pre(/^find/,function(){
    this.populate('user').populate({
        path:'tour',
        select:'name',
    })
})

const bookingModel=new mongoose.model('Booking',bookingSchema);
module.exports=bookingModel;