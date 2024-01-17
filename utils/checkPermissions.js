const customError=require('../errors')

const checkPermissions = (requestUser,resourceUserId) => {
    if(requestUser.role === 'admin') return;
    if(requestUser.userId === resourceUserId.toString()) return;
    
    throw new customError.UnAuthorizedError('Not Authorized to access this route')
}

module.exports=checkPermissions;