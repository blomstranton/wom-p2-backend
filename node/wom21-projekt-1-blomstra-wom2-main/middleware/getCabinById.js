const Cabin = require("../models/cabins")

module.exports = async (req, res, next) => {
    try{
        const cabin = await Cabin.findOne({ _id: req.params.id }).exec()
        if (!cabin) return res.status(404).json({message: 'Cabin not found'})
        req.cabin = cabin
        next()
    }catch(err){
        console.log(err)
    }
    
}
