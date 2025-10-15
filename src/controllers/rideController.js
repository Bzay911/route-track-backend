import Ride from "../models/rideModel.js";

export const rideController = {
  async createRide(req, res) {
    const { rideName, destination, selectedDate, selectedTime, description } =
      req.body;
      if (!rideName || !destination || !selectedDate || !selectedTime) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }
    try {
      const ride = await Ride.create({
       rideName: rideName,
       rideDestination: destination,
       rideDate: selectedDate,
       rideTime: selectedTime,
       rideDescription: description,
      });
   

      res.status(201).json({
        success: true,
        message: "Ride created successfully",
        ride,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  async getAllRides (req,res) {
    try{
        const rides = await Ride.find().sort({createdAt: -1}); // getting the newest first
        return res.status(200).json({
            success: true,
            message: "Rides fetched successfully",
            data: rides
        });
    }catch(error){
        console.error("Error fetching rides: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch rides",
            error: error.message
        })
    }
  }
};
