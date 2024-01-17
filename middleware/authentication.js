const customError=require('../errors/index')
const {isTokenValid}=require('../utils/index')

const authenticateUser = async (req,res,next) => {
    const token=req.signedCookies.token
    
    if(!token)
    {
        throw new customError.UnAuthenticatedError('Authetication Invalid')
    }
    
    try {
        const { name,userId,role }=isTokenValid({ token });
        req.user={name,userId,role}
        next()
    } catch (error) {
        throw new customError.UnAuthenticatedError('Authentication Invalid');
    }
}

const authorizePermissions = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            throw new customError.UnAuthorizedError('UnAuthorized to access this route')
        }
        next()
    }
}

module.exports={
    authenticateUser,
    authorizePermissions,
}