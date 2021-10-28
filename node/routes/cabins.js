const express = require('express')
const router = express.Router()
const Cabin = require('../models/cabins')
const User = require('../models/users')
const requireJwt = require("../middleware/requireJwt")
const getCabinById = require("../middleware/getCabinById")

// Man måste vara inloggad för att kunna se vilka stugot man har
router.get('/owned', requireJwt,async (req, res) => {
    try {
        console.log(req.user)
        const cabins = await Cabin.find({owner:req.user.id})
        res.send(cabins)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})

// Man måste vara inloggad för att kunna se stugor
router.get('/:id', requireJwt,async (req, res) => {
    try {
        const cabin = await Cabin.findById(req.params.id).exec()
        if (!cabin) return res.status(400).json({ message: "No cabin with that id" })
        res.json(cabin)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
// Man måste vara inloggad för att kunna se alla stugor
router.get('/', requireJwt,async (req, res) => {
    try {
        const cabins = await Cabin.find({archived:false})
        res.send(cabins)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})

// Man måste vara inloggad för att kunna se vilka stugot man har
router.get('/owned', requireJwt,async (req, res) => {
    try {
        const cabins = await Cabin.find({owner:req.owner})
        res.send(cabins)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})

router.post('/',requireJwt, async (req, res) => {
    try {
        const owner = req.user
        const cabin = new Cabin({
            owner: owner.id,
            address: req.body.address,
            sqm: req.body.sqm,
            sauna: req.body.sauna,
            beach: req.body.beach,
            price: req.body.price,
            beds: req.body.beds,
            extraInfo: req.body.extraInfo,
            archived: false
        })
        const newCabin = await cabin.save()
        res.status(201).send(newCabin)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/:id', requireJwt,async (req, res) => {
    try {
        const cabin = await Cabin.findById(req.params.id).exec()
        if (!cabin) return res.status(400).json({ message: "No cabin with that id" })
        if(cabin.owner == req.user.id){
            try{
                if(cabin.archived){
                    await Cabin.deleteOne({_id: req.params.id})
                    return res.status(200).json({message : "Cabin removed"})
                }else{
                    await Cabin.updateOne({_id:req.params.id}, {archived : true})
                    return res.status(200).jsin({message : "Cabin archived"})
                }
            }catch(err){
                return res.status(500).json({message : err.message})
            }
        }else{
            return res.status(500).json({message : "Cant delete someone elses cabin"})
        }
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
})

router.put("/:id", requireJwt,getCabinById, async (req,res) => {
    try {
        // Kollar så att den inloggade användaren är den som äger stugan
        if(req.user.id == req.cabin.owner){
            // Kollar så att alla fält finns med i requesten
            if(req.body.address && req.body.sqm && (req.body.sauna !== null) && (req.body.beach !== null) && req.body.price && req.body.beds){
                const updatedCabin = await req.cabin.updateOne(req.body).exec()
                res.json({message: "Cabin updated!", modified: updatedCabin.modifiedCount})
            }else{
                return res.status(401).json({message : "Cant PUT with missing info"})
            }
        }else{
            return res.status(401).json({message : "You can only change your own cabins"})
        }
    } catch (error) {
        res.status(500).json({message : error.message})
    }
})

router.patch("/:id", requireJwt,getCabinById, async (req,res) => {
    try {
        // Kollar så att den inloggade användaren är den som äger stugan
        if(req.user.id == req.cabin.owner){
        const updatedCabin = await req.cabin.updateOne(req.body).exec()
        res.json({message: "Cabin updated!", modified: updatedCabin.modifiedCount})
        }else{
            return res.status(401).json({message : "You can only change your own cabins"})
        }
    } catch (error) {
        res.status(500).json({message : error.message})
    }
})

module.exports = router