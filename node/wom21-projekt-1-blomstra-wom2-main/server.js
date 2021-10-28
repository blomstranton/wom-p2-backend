// Imports
const express = require('express');
const mongoose = require('mongoose')
const app = express();
const PORT = process.env.PORT || 3030;
require('dotenv').config()
app.use(express.json())

// Route imports
const usersRouter = require('./routes/users')
const cabinsRouter = require('./routes/cabins')
const bookingsRouter = require('./routes/bookings')

// Mongoose connection 
mongoose.connect(process.env.DB_URL)
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to DB'))

// Routes
app.use('/users', usersRouter)
app.use('/cabins', cabinsRouter)
app.use('/bookings', bookingsRouter)

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
