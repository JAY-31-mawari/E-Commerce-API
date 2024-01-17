require('dotenv').config()
require('express-async-errors')

const express=require('express')
const app=express()
const cors=require('cors')
const fileUpload=require('express-fileupload')
const rateLimiter=require('express-rate-limit')
const helmet=require('helmet')
const xss=require('xss-clean')
const mangoSanitize=require('express-mongo-sanitize')
const connectDB=require('./db/connect')

const authRouter=require('./routes/authRoutes')
const userRouter=require('./routes/userRoutes')
const productRouter=require('./routes/productRoutes')
const reviewRouter=require('./routes/reviewRoutes')
const orderRouter=require('./routes/orderRoutes')

const errorHandlerMiddleware=require('./middleware/error-handler')
const notFoundMiddleware=require('./middleware/not-found')

const port=process.env.PORT || 4000


app.set('trust proxy',1)
app.use(
    rateLimiter({
        windowMs:15 * 60 * 1000,
        max:60,
    })
)
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(mangoSanitize());
app.use(express.json())
app.use(express.static('./public'))
app.use(fileUpload())

app.get("/",(req,res)=>{
    res.send("Ecommerce-API")
})

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/users',userRouter)
app.use('/api/v1/products',productRouter)
app.use('/api/v1/reviews',reviewRouter)
app.use('/api/v1/orders',orderRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const start = async (req,res) => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port,()=> console.log(`Server is successfully running on port ${port}`))   
    } catch (error) {
        console.log(error)
    }
}

start()
