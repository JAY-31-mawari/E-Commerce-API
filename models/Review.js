const mongoose=require('mongoose')

const ReviewSchema = new mongoose.Schema(
    {
        rating:{
            type:Number,
            min:1,
            max:5,
            required:[true,'Please provide rating'],
        },
        title:{
            type:String,
            required:[true,'Please provide review title'],
            maxlength:100,
        },
        comment:{
            type:String,
            minlength:3,
        },
        user:{
            type:mongoose.Schema.ObjectId,
            ref:'User',
        },
        product:{
            type:mongoose.Schema.ObjectId,
            ref:'Product',
        },
    },
    {timestamps:true}
)

module.exports=mongoose.model('Review',ReviewSchema)