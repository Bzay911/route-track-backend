import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client();

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.EXPIRES_IN;
const CLIENT_IDS = [
  process.env.ANDROID_CLIENT_ID,
  process.env.IOS_CLIENT_ID,
]

console.log(`JWT_SECRET: ${JWT_SECRET}`);
console.log(`EXPIRES: ${EXPIRES_IN}`);


export const userController = {
  // handle google sign in
  async handleGoogleSignin(req, res){
    try{
      const {idToken} = req.body;
      // verifying the token with google
      const ticket = await client.verifyIdToken({
        idToken: idToken,
        requiredAudience: CLIENT_IDS
      });
      const payload = await ticket.getPayload();
      const {email, name} = payload;

      let user = await User.findOne({email})

      if(!user){
        console.log('No any user found creating one');
        user  = await User.create({email, displayName: name})
      }

      const appToken = jwt.sign(
        { id: user._id, email: user.email},
      JWT_SECRET,
      {expiresIn: EXPIRES_IN}
      )
      res.status(201).json({
        appToken,
        user: { email: user.email, displayName: user.displayName }
      })
    }catch(error){
      console.log(error);
      res.status(401).json({message: "Invalid Google token"});
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
        id: user._id,
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
};
