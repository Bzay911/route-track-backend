import express from 'express'
import connectDB from './src/config/db.js'
import dotenv from 'dotenv'
import rideRoutes from './src/routes/rideRoutes.js'
import userRoutes from './src/routes/userRoutes.js'
import inviteRoutes from './src/routes/inviteRoute.js'
import { Server } from 'socket.io'
import {createServer} from 'http';
import setupRideSockets from './sockets/rideSocket.js'

dotenv.config()

const app = express()
const port = 3000

// Middleware
app.use(express.json())

// Connect to MongoDB
connectDB()

// Routes
app.use('/api/rides', rideRoutes)
app.use('/api/auth', userRoutes)
app.use('/api/invites', inviteRoutes)


// Creating HTTP server for Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer);

setupRideSockets(io);

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
