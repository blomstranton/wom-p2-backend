const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Booking = require('../models/bookings')
const requireJwt = require('../middleware/requireJwt')
const getBookingById = require('../middleware/getBookingById')

// Man måste vara inloggad för att kunna se alla bokningar
router.get("/", requireJwt,async (req,res)=>{
    const allBookings = await Booking.find({}).exec()
    if(!allBookings) return res.status(204).json("No bookings found")
    return res.status(200).json(allBookings)
})

router.post("/", requireJwt, async (req,res) => {
    try {
        const owner = req.user
        const startDate = new Date(req.body.startDate)
        const endDate = new Date(req.body.endDate)
        // Kollar så att start date kommer före endDate
        if((startDate.getTime()) > (endDate.getTime())) return res.status(500).json({message: "Start date cant be later than end date"})
        const bookingsWithSameCabin = await Booking.find({cabin : req.body.cabin})
        // Kollar om de nya start & slut datumen är mellan någon av de andra bokningarna med samma stuga
        // OBS, kollar ändast om de valda datumen, inte tiden emellan datumen
        for(let i = 0; i < bookingsWithSameCabin.length; i++){
            const oldBookingStartDate = bookingsWithSameCabin[i].startDate.getTime() 
            const oldBookingEndDate = bookingsWithSameCabin[i].endDate.getTime() 
            if(((startDate.getTime()) >= oldBookingStartDate && (startDate.getTime()) <= oldBookingEndDate)){
                return res.status(500).json({message: "Cant create booking, the dates overlap with another booking"})
            }
            
        }
        const booking = new Booking({
            owner: owner.id,
            cabin : req.body.cabin,
            startDate : startDate,
            endDate : endDate
        })
        const newBooking = await booking.save()
        res.status(201).send(newBooking)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//TODO: Finns ingen koll så de nya datumen inte krockar med någon annan bokning
router.patch("/:id", requireJwt,getBookingById, async (req,res) => {
    try {
        // Kollar så att den inloggade användaren är den som har gjort bokningen
        if(req.user.id == req.booking.owner){
        const updatedBooking = await req.booking.updateOne(req.body).exec()
        res.json({message: "Booking updated!", modified: updatedBooking.modifiedCount})
        }else{
            return res.status(401).json({message : "You can only change your own bookings"})
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//TODO: Finns ingen koll så de nya datumen inte krockar med någon annan bokning
router.put("/:id", requireJwt,getBookingById, async (req,res) => {
    try {
        // Kollar så att den inloggade användaren är den som äger bokningen
        if(req.user.id == req.booking.owner){
            // Kollar så att alla fält finns med i requesten
            if(req.body.cabin && req.body.startDate && req.body.endDate){
                const updatedBooking = await req.booking.updateOne(req.body).exec()
                res.json({message: "Booking updated!", modified: updatedBooking.modifiedCount})
            }else{
                return res.status(401).json({message : "Cant PUT with missing info"})
            }
        }else{
            return res.status(401).json({message : "You can only change your own bookings"})
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/:id', requireJwt,async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).exec()
        if (!booking) return res.status(400).json({ message: "No booking with that id" })
        if(booking.owner == req.user.id){
            try{
                // Bokningar har ingen archived så de tas bort direkt
                await Booking.deleteOne({_id: req.params.id})
                return res.status(200).json({ message: "Booking removed" })
            }catch(err){
                return res.status(500).json({ message: error.message })
            }
        }else{
            return res.status(500).json({message : "Cant delete someone elses booking"})
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

module.exports = router
