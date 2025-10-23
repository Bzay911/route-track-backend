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
     }
  
}, {timestamps: true})

const Ride = mongoose.model('Ride', rideSchema)

export default Ride;