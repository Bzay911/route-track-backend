import Invite from "../models/invite.js";
import Ride from "../models/ride.js";
import User from "../models/user.js";

export const InviteController = {
  async inviteUser(req, res) {
    const { inviteeEmail, rideId } = req.body;
    const inviterId = req.user._id;

    if (!inviteeEmail || !rideId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    try {
      const invitee = await User.findOne({ email: inviteeEmail });
      // checking if invitee user exists
      if (!invitee) {
        return res.status(404).json({
          success: false,
          message: "Invitee user not found",
        });
      }

      // checking if ride exists
      const ride = await Ride.findById(rideId);
      if (!ride) {
        return res.status(404).json({
          success: false,
          message: "Ride not found",
        });
      }

      // checking if existing invite exists
      const existingInvite = await Invite.findOne({
        inviteeEmail,
        rideId,
        status: "pending",
      });

      if (existingInvite) {
        return res.status(400).json({
          success: false,
          message: "An invite has already been sent to this user for the ride",
        });
      }

      // checking if invitee is already a rider in the ride
      const isAlreadyRider = ride.riders.some(rider => 
        rider.user.toString() === invitee._id.toString()
      );

      if (isAlreadyRider) {
        return res.status(400).json({
          success: false,
          message: "User is already a rider in this ride"
        });
      }

      // creating new invite
      const invite = await Invite.create({
        inviteeId: invitee._id,
        inviteeEmail,
        invitedby: inviterId,
        rideId,
      });

      return res.status(201).json({
        success: true,
        message: "Invite sent successfully",
        invite,
      });
    } catch (error) {
      console.error("Error inviting user:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while sending invite",
      });
    }
  },
  async getAllInvites(req, res) {
    // gettig the id from the auth middleware
    const userId = req.user._id;
    const user = await User.findById(userId);
    if(!user){
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    
    // find pending invites for the user
    const invites = await Invite.find({
        inviteeEmail: user.email,
        status: "pending",
    })
    .populate('invitedby', 'displayName email')
    .populate('rideId', 'rideName rideDate');
    
    // .find always returns an array like [] for null or some data[]
    if (invites.length === 0) {
      return res.status(404).json({
        success: "false",
        message: "No any pending invites found for the user",
      });
    }

    return res.status(201).json({
      success: "true",
      message: "Pending invites fetched successfully",
      pendingInvites: invites,
    });
  },

  async acceptInvite(req, res){
    const {inviteId} = req.params;
    const invite = await Invite.findById(inviteId);
    if(!invite){
        return res.status(404).json({
            success: "false",
            message: "No any pending invite found with this id"
        })
    }
    if(invite.status !== 'pending'){
        return res.status(400).json({
            message: "Invite already responded!"
        })
    }
    // Mark invite as accepted
    invite.status = "accepted";
    await invite.save();

    // Add user to the ride riders
    const ride = await Ride.findById(invite.rideId);
    if(!ride){
        return res.status(404).json({
            success: 'false',
            message: 'No any ride found for this id'
        })
    }
    const invitee = await User.findById(invite.inviteeId);
       if(!invitee){
        return res.status(404).json({
            success: 'false',
            message: 'No any invitee found for this id'
        })
    }
    ride.riders.push({user: invitee});
    await ride.save();

    res.json({success: true, message: "Invite accepted", invite})

  },

    async rejectInvite(req, res){
    const {inviteId} = req.params;
    const invite = await Invite.findById(inviteId);
    if(!invite){
        return res.status(404).json({
            success: "false",
            message: "No any pending invite found with this id"
        })
    }
    if(invite.status !== 'pending'){
        return res.status(400).json({
            message: "Invite already responded!"
        })
    }
    // Mark invite as accepted
    invite.status = "rejected";
    await invite.save();

    // Add user to the ride riders
    const ride = await Ride.findById(invite.rideId);
    if(!ride){
        return res.status(404).json({
            success: 'false',
            message: 'No any ride found for this id'
        })
    }
    const invitee = await User.findById(invite.inviteeId);
       if(!invitee){
        return res.status(404).json({
            success: 'false',
            message: 'No any invitee found for this id'
        })
    }
    ride.riders.push({user: invitee});
    await ride.save();

    res.json({success: true, message: "Invite rejected", invite})

  }
};
