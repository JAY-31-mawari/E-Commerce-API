const User=require('../models/User')
const {StatusCodes}=require('http-status-codes')
const CustomError=require('../errors/index')
const {createTokenUser,attachCookiesToResponse}=require('../utils/index')

const register = async (req,res) => {
    const {name,email,password}=req.body;
    
    const emailAlreadyExists=await User.findOne({ email });
    if(emailAlreadyExists)
    {
        throw new CustomError.BadRequestError('Email Already exists')
    }
    const isFirstAccount= (await User.countDocuments({})) === 0;
    const role=isFirstAccount ? 'admin':'user';
    const user=await User.create({ name,email,password,role });

    const tokenUser=createTokenUser(user);
    attachCookiesToResponse({res , user:tokenUser})

    res.status(StatusCodes.CREATED).json({ user:tokenUser })

}

const login = async (req,res) => {
    const {email,password}=req.body;

    if(!email || !password)
    {
        throw new CustomError.BadRequestError('Please provide email and password')
    }
    const user=await User.findOne({email});

    if(!user)
    {
        throw new CustomError.BadRequestError('Invalid Email id')
    }
    const isPasswordCorrect=await user.comparePassword(password);

    if(!isPasswordCorrect)
    {
        throw new CustomError.BadRequestError('Invalid Credentials')
    }
    const tokenUser=createTokenUser(user);
    attachCookiesToResponse({ res , user: tokenUser})
    res.status(StatusCodes.OK).json({ user:tokenUser })
}

const logout = (req,res) => {
    res.cookie('token','logout',{
        httpOnly:true,
        expires: new Date(Date.now() + 1000),
    })
    res.status(StatusCodes.OK).json({ msg:'user logged out '})
}

module.exports={
    register,
    login,
    logout
}