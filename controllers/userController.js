const User=require('../models/User')
const {StatusCodes} = require('http-status-codes')
const customError=require('../errors');
const { checkPermissions, attachCookiesToResponse ,createTokenUser } = require('../utils');


const getAllUsers = async (req,res) => {
    const users=await User.find({ role: 'user' }).select('-password');
    res.status(StatusCodes.OK).json({ users });
}

const getSingleUser = async (req,res) => {
    const {id:userId}=req.params
    const user=await User.findById({ _id:userId }).select('-password')
    if(!user)
    {
        throw new customError.NotFoundError(`No user with id: ${userId}`)
    }
    checkPermissions(req.user,user._id)
    res.status(StatusCodes.OK).json({ user })
}

const showCurrentUser = async (req,res) => {
    res.status(StatusCodes.OK).json({ user: req.user })
}
 
const updateUser = async (req,res) => {
    const {name,email}=req.body
    if(!name || !email)
    {
        throw new customError.BadRequestError('Please provide all values')
    }

    const user=await User.findByIdAndUpdate(
        {_id:req.user.userId},
        {name,email},
        {new:true,runValidators:true},
    )

    const tokenUser=createTokenUser(user);
    attachCookiesToResponse({ res , user:tokenUser })
    res.status(StatusCodes.OK).json({ user:tokenUser })
}

const updateUserPassword = async (req,res) => {
    const{oldPassword,newPassword}=req.body

    if(!oldPassword || !newPassword)
    {
        throw new customError.BadRequestError('Please provide both values')
    }
    const user=await User.findById({ _id:req.user.userId })
    
    const isPasswordCorrect=await user.comparePassword(oldPassword)
    if(!isPasswordCorrect)
    {
        throw new customError.UnAuthenticatedError('Invalid Credentials')
    }

    user.password=newPassword
    
    await user.save();
    res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated.' })
}

module.exports={
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
}


