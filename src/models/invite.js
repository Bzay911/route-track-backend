import mongoose from 'mongoose'

const inviteSchema = new mongoose.Schema({
   inviteeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invite',
      required: true
   },
    inviteeEmail: {
        type: String,
        required: true
    },
     invitedby:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
     },
     rideId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ride',
        required: true
     },
     status:{
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
     }
  
}, {timestamps: true})

const Invite = mongoose.model('Invite', inviteSchema)

export default Invite;