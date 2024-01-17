const Order=require('../models/Order')
const Product=require('../models/Product')

const customError=require('../errors')
const {StatusCodes}=require('http-status-codes')
const {checkPermissions}=require('../utils/index')

const createOrder = async (req,res) => {
    const {items:cartItems}=req.body
    if(!cartItems || cartItems.length < 1)
    {
        throw new customError.BadRequestError('No items provided')
    }
    let orderitems=[]
    for(const item of cartItems)
    {
        const dbProduct=await Product.find({ _id:item.product })
        if(!dbProduct)
        {
            throw new customError.NotFoundError(`No product with id: ${itemproduct}`)
        }
        const {name,price}=dbProduct;
        const singleOrderItem={
            name,
            price,
        }
        orderitems=[...orderitems,singleOrderItem]
    }
    const order=await Order.create({ orderItems })
    res.status(StatusCodes.CREATED).json({ order })
}   

const getAllOrders = async (req,res) => {
    const orders=await Order.find({});
    res.status(StatusCodes.OK).json({ count:orders.length,orders})
}

const getSingleOrder = async (req,res) => {
    const {id:orderId}=req.params;
    const order=await Order.findOne({ _id:orderId })
    if(!order)
    {
        throw new customError.NotFoundError(`No order with id: ${orderId}`)
    }
    //checkPermissions(req.user,order.user)
    res.status(StatusCodes.OK).json({ order })
}

const getCurrentUserOrders = async (req,res) => {
    const orders=await Order.find({ user : req.user.userId });
    res.status(StatusCodes.OK).json({ count:orders.length,orders })
}

const updateOrder = async (req,res) =>{
    const {id:orderId}=req.params

    const order=await Order.findOne({ _id:orderId })
    if(!order)
    {
        throw new customError.NotFoundError(`No order with id: ${orderId}`)
    }
    checkPermissions(req.user,order.user)
    //order.status='paid'
    //await order.save()

    res.status(StatusCodes.OK).json({ order })
}

module.exports={
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    updateOrder,
    createOrder,
}