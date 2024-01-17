const mongoose=require('mongoose')

const ProductSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            trim:true,
            required:[true,'Please provide product name'],
            maxlength:[100,'Name cannot be more than 100 characters'],
        },
        price:{
            type:Number,
            required:[true,'Please provide product price'],
            default:0,
        },
        description:{
            type:String,
            //required:[true,'Please provide product description'],
            maxlength:[1000,'Description cannot be more than 1000 characters'],
        },
        image:{
            type:String,
            default:'/uploads/example.jpeg',
        },
        category:{
            type:String,
            //required:[true,'Please provide product category'],
            //enum:['office','kitchen','bedroom'],
        },
        featured:{
            type:Boolean,
            default:false,
        },
    },
    {timestamps:true}
)

module.exports=mongoose.model('Product',ProductSchema)