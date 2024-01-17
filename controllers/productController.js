const Product=require('../models/Product')
const {StatusCodes}=require('http-status-codes')
const {BadRequestError,NotFoundError}=require('../errors/index')
const path=require('path')


const getAllProducts = async (req,res) => {
    const {search,filter,sort}=req.query
    const queryObject={}

    if(search)
    {
        queryObject.name= {$regex:search,$options:'i'}
    }
    if(filter)
    {
        const objectMap={
            '>':'$gt',
            '>=':'$gte',
            '=':'$eq',
            '<':'$lt',
            '<=':'$lte',
        }
        const Regex=/\b(<|>|=|>=|<=)\b/g
        let filters=filter.replace(Regex,(match)=>`-${objectMap[match]}-`)

        filters=filters.split(',').map((item)=>{
            const [field,operator,value]=item.split('-');
            if(field.includes('price'))
            {
                queryObject[field]={[operator]:Number(value)}
            }
        })
    }
    
    let result=Product.find(queryObject).select('name price')
    if(sort === 'a-z')
    {   
        result=result.sort('name price')
    }
    if(sort === 'z-a')
    {
        result=result.sort('-name -price')
    }

    let page=req.query.page || 1;
    let limit=req.query.limit || 10;
    let skip=(page-1)*limit
    result=result.skip(skip).limit(limit)

    let totalProducts=await Product.countDocuments(queryObject)
    let numOfPages=Math.ceil(totalProducts/limit)

    let products=await result
    res.status(StatusCodes.OK).json({ count:products.length,totalProducts,numOfPages,products })
}

const createProduct = async (req,res) => {
    const product=await Product.create(req.body)
    res.status(StatusCodes.CREATED).json({ product })
}

const getSingleProduct = async (req,res) => {
    const {id:productId}=req.params
    const product=await Product.findById({ _id:productId })
    if(!product)
    {
        throw new NotFoundError(`No Product with id: ${productId}`)
    }
    res.status(StatusCodes.OK).json({ product })
}

const updateProduct = async (req,res) => {
    const {id:productId}=req.params
    const {name,price}=req.body
    /*const product=await Product.findByIdAndUpdate(
        {_id:productId},
        req.body,
        {new:true,runValidators:true}
    )*/
    const product=await Product.findOne({_id:productId})
    if(!product)
    {
        throw new NotFoundError(`No Product with id: ${productId}`)
    }
    product.name=name
    product.price=price

    await product.save()
    res.status(StatusCodes.OK).json({ product })
}

const deleteProduct = async (req,res) => {
    const {id:productId}=req.params
    const product=await Product.findByIdAndDelete({ _id:productId})
    
    if(!product)
    {
        throw new NotFoundError(`No Product with id: ${productId}`)
    }
    res.status(StatusCodes.OK).json({ msg:"Product Deleted Successfully" })
}

const uploadImage = async (req,res) => {
    if(!req.files)
    {
        throw new BadRequestError('No File Uploaded')
    }
    const productImage=req.files.image
    if(!productImage.mimetype.startsWith('image'))
    {
        throw new BadrequestError('Please Upload Image')
    }
    const maxSize=1024 * 1024;
    
    if(productImage.size > maxSize)
    {
        throw new BadRequestError('Please upload image smaller than 1MB');
    }
    const imagePath=path.join(
        __dirname,
        '../public/uploads'+`${productImage.name}`
    );
    await productImage.mv(imagePath);
    res.status(StatusCodes.OK).json({ image:`/uploads/${productImage.name}`})
}

module.exports={
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
}