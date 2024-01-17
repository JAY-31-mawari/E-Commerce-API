const mongoose=require('mongoose')

const SingleItemOrderSchema=new mongoose.Schema({
    name:{type:String,required:true},
    price:{type:Number,required:true},
    product:{type:mongoose.Schema.ObjectId,ref:'Product',required:true},
})

const OrderSchema=new mongoose.Schema({
    orderItems:[SingleItemOrderSchema],
    total:{
        type:Number,
    },
    paymentmethod:{
        type:String,
    },
},{timestamps:true})

module.exports=mongoose.model('Order',OrderSchema)