const notFound = (req,res) => res.status(404).send("<h1>Route Does Not Exist</h1>")

module.exports=notFound