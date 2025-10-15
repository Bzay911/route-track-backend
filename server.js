import express from 'express'
import connectDB from './src/config/db.js'
import dotenv from 'dotenv'
import rideRoutes from './src/routes/rideRoutes.js'

dotenv.config()

const app = express()
const port = 3000

// Middleware
app.use(express.json())

// Connect to MongoDB
connectDB()

// Routes
app.use('/api/rides', rideRoutes)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
