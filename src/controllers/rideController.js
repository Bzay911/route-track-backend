import Ride from "../models/ride.js";

export const rideController = {
  async createRide(req, res) {
    const {
      rideName,
      destinationCoords,
      destinationName,
      selectedDate,
      selectedTime,
      description,
    } = req.body;
    if (!rideName || !destinationCoords || !selectedDate || !selectedTime) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }
    try {
      const ride = await Ride.create({
        rideName: rideName,
        rideDestination: destinationName,
        destinationCoords: destinationCoords,
        rideDate: selectedDate,
        rideTime: selectedTime,
        rideDescription: description,
        createdby: req.user._id,
      });

      const userId = req.user._id;
      // adding the creator as the first rider
      ride.riders.push({ user: userId, ready: false });
      await ride.save();

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

  async getAllRides(req, res) {
    try {
      const userId = req.user._id;

      // getting all the rides where the user is a rider
      const rides = await Ride.find({
        "riders.user": userId,
      })

        .sort({ createdAt: -1 }) // sort by creation date descending
        .populate("riders.user", "displayName email")

      return res.status(200).json({
        success: true,
        message: "Rides fetched successfully",
        data: rides,
      });
    } catch (error) {
      console.error("Error fetching rides: ", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch rides",
        error: error.message,
      });
    }
  },

  async getRideById(req, res) {
    // getting rideId from the params
    const { rideId } = req.params;
    try {
      // checking if rideId is provided
      if (!rideId) {
        return res.status(400).json({
          success: false,
          message: "Ride ID is required",
        });
      }

      // finding ride by ID
      const ride = await Ride.findById(rideId)
      .populate("riders.user", "displayName email _id")
      if (!ride) {
        return res.status(404).json({
          success: false,
          message: "Ride not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Ride fetched successfully",
        data: ride,
      });
    } catch (error) {
      console.error("Error fetching ride by ID: ", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch ride",
        error: error.message,
      });
    }
  },
};
