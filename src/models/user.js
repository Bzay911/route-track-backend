import mongoose from "mongoose";
const { Schema } = mongoose;
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
    default: 'Anonymous',
    required: true,
  },
  profilePicture: {
    type: String,
    default: null,
  },
  expoPushToken:{
    type: String,
    default: null
  }
},  {timestamps: true});

userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
