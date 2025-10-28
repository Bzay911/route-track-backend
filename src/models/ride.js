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
    destinationCoords: {
        type: [Number],
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
     riders:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
     }],
     createdby:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
     }
  
}, {timestamps: true})

const Ride = mongoose.model('Ride', rideSchema)

export default Ride;