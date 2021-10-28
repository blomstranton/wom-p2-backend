require('dotenv').config()
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader?.split(' ')[1]
        const user = jwt.verify(token, process.env.JWT_SECRET)
        req.user = user
        next()
    } catch (error) {
        return res.json({message: error.message})
    }
        
}