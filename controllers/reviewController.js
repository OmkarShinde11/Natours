const Review = require("../Models/reviews");
const catchAsync = require("../utilities/catchAsync");
const { deleteOne, updateOne, createDoc, getOne, getAll } = require("./factoryHandler");
const AppError = require("../utilities/appError");
const mongoose = require("mongoose");
const bookingModel = require("../Models/booking");

// const getAllReview=catchAsync(async(req,res,next)=>{
//     let  filter={};
//     if(req.params.tourId) filter={tourRef:req.params.tourId};
//     const reviews=await Review.find(filter);
//     res.status(200).json({
//         status:'Success',
//         data:{
//             reviews
//         }
//     })
// });

const getAllReview=getAll(Review);

const setReviewData=catchAsync(async(req,res,next)=>{
    if(!req.body.userRef) req.body.userRef=req.user.id;
    if(!req.body.tourRef)req.body.tourRef=req.params.tourId;
    const userRef = mongoose.Types.ObjectId(req.body.userRef);
    const tourRef = mongoose.Types.ObjectId(req.body.tourRef);
    const permission = await bookingModel.aggregate([
        {
            $match: {
                $and: [{ user: userRef }, { tour: tourRef }],
            }
        }
    ]);

    // const permission = await bookingModel.find({});
    if(permission.length==0){
        return next(new AppError('User is not allowed to review about tour because it not book that tour.',403))
    }
    next();
});

const createReview=createDoc(Review);
const getSingleReview=getOne(Review);
const deleteReview=deleteOne(Review);
const updateReview=updateOne(Review);

module.exports={
    getAllReview,
    createReview,
    deleteReview,
    updateReview,
    setReviewData,
    getSingleReview
}