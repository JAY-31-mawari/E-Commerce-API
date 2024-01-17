const BadRequestError = require('./bad-request')
const CustomAPIError=require('./custom-error')
const NotFoundError=require('./not-found')
const UnAuthenticatedError=require('./unauthenticated')
const UnAuthorizedError=require('./unauthorized')

module.exports={
    CustomAPIError,
    BadRequestError,
    NotFoundError,
    UnAuthenticatedError,
    UnAuthorizedError,
}