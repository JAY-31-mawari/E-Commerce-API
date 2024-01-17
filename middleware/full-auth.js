const CustomError=require('../errors')
const { isTokenValid }=require('../utils')

const authenticateUser = (req,res,next) => {
    let token;
    const authHeader=req.headers.authorization;
    if(authHeader && authHeader.startsWith('Bearer'))
    {
        token=authHeader.split(' ')[1]
    }
    else{
        token=req.cookies.token;
    }
    if(!token)
    {
        throw new CustomError.UnAuthenticatedError('Authentication Invalid')
    }
    
    try {
        const payload=isTokenValid(token);
        
        // Attach the user and his permissions to the req object
        req.user={
            userId:payload.user.userId,
            role:payload.user.role,
        }
        next();
    } catch (error) {
        throw new CustomError.UnAuthenticatedError('Authentication Invalid')
    }
}

const authorizeRoles = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role))
        {
            throw new CustomError.UnAuthorizedError('Unauthorized to access this route')
        }
        next();
    }
}

module.exports={
    authenticateUser,
    authorizeRoles
}