const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/users')
const requireJwt = require('../middleware/requireJwt')

// Man måste vara inloggad för att se alla användare
router.get("/", requireJwt,async (req, res) => {
    try {
        const users = await User.find({}, 'firstName lastName').exec()
        res.send(users)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }).exec()
        if (!user) return res.status(400).json({ message: "No such user" })

        const match = await bcrypt.compare(req.body.password, user.password)
        if (match) {

            const data = {
                id: user._id,
                email: user.email,
            }

            const accessToken = await jwt.sign(
                data,
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            )

            return res.status(201).json({token : accessToken})

        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


router.post('/', async (req, res) => {
    try {
        const oldUSer = await User.findOne({ email: req.body.email }).exec()
        if (oldUSer) return res.status(400).json({ message: "User with that email already exist" })

        const hashedPassword = await bcrypt.hash(req.body.password, 12)

        const user = new User({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hashedPassword
        })
        const newUser = await user.save()
        // TODO: ta bort så att hashen inte kommer med i responsen
        res.status(201).send(newUser)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router
