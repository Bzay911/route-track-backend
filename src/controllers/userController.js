import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import  User  from "../models/user.js";
import { OAuth2Client } from "google-auth-library";
import Ride from "../models/ride.js";


const client = new OAuth2Client();

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.EXPIRES_IN;
const CLIENT_IDS = [process.env.ANDROID_CLIENT_ID, process.env.IOS_CLIENT_ID];

export const userController = {
  // handle google sign in
  async handleGoogleSignin(req, res) {
    try {
      const { idToken } = req.body;
      // verifying the token with google
      const ticket = await client.verifyIdToken({
        idToken: idToken,
        requiredAudience: CLIENT_IDS,
      });
      const payload = await ticket.getPayload();
      const { email, name } = payload;

      let user = await User.findOne({ email });

      if (!user) {
        console.log("No any user found creating one");
        user = await User.create({ email, displayName: name });
      }

      const appToken = jwt.sign(
        { id: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: EXPIRES_IN }
      );
      res.status(201).json({
        appToken,
        user: { email: user.email, displayName: user.displayName },
      });
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: "Invalid Google token" });
    }
  },

  // Validate token
  async validateToken(req, res) {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({
          error: "User not found",
          message: "Please create an account first",
        });
      }
      const userData = {
       _id: user._id,
        email: user.email,
        displayName: req.user.displayName,
        profilePicture: req.user.profilePicture,
      };

      res.json({
        valid: true,
        user: userData,
      });
    } catch (error) {
      console.error("Token validation error:", error);
      res.status(401).json({
        valid: false,
        error: "Invalid token",
      });
    }
  },

  async inviteRider(req, res) {
    const { id, inviteeEmail } = req.body;
    console.log("Inviting rider:", inviteeEmail, "to ride:", id);
    try {
      // find ride by id
      const ride = await Ride.findById(id);
      if (!ride) {
        return res.status(404).json({ message: "Ride not found" });
      }

      // find the invitee by email
      const invitee = await User.findOne({ email: inviteeEmail });

      // checking if invitee is alrady a rider
      if (invitee) {
        if (ride.riders.includes(invitee._id)) {
          return res.status(400).json({ message: "User is already a rider" });
        }
        // if not a rider, add to riders list
        ride.riders.push({user: invitee._id, ready: false});
        await ride.save();
        return res.status(200).json({ message: "Rider invited successfully" });
      }
      return res.status(404).json({ message: "Invitee user not found! Ask to join the app first" });
    } catch (error) {
      console.error("Error inviting user:", error);
      return res.status(500).json({ error: "Failed to invite user" });
    }
  },
};
