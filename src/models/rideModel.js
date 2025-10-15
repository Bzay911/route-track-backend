import mongoose from 'mongoose'

const rideSchema = new mongoose.Schema({
    rideName: {
        type: String,
        required: true
    },
    rideDestination: {
        type: String,
        required: true
    },
    rideDate: {
        type: String,
        required: true
    },
    rideTime: {
        type: String,
        required: true
    },
    rideDescription: {
        type: String,
     },
     createdAt: {
        type: Date,
        default: Date.now
     }
})

const Ride = mongoose.model('Ride', rideSchema)

export default Ride;