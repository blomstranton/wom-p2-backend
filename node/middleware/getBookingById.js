const Booking = require("../models/bookings")

module.exports = async (req, res, next) => {
    try{
        const booking = await Booking.findOne({ _id: req.params.id }).exec()
        if (!booking) return res.status(404).json({message: 'Booking not found'})
        req.booking = booking
        next()
    }catch(err){
        console.log(err)
    }
    
}
