import Ride from "../src/models/ride.js";
import User from "../src/models/user.js";

export default function setupRideSockets(io) {
  // listening for riders connection
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // join a ride room
    socket.on("joinRide", ({rideId}) => {
      console.log('user joining ride room from join ride:', rideId);
      socket.join(rideId);
    });

    // user joined the ride
    socket.on("userJoined", async ({ rideId, displayName }) => {
      // Notify others in the room that a new user has joined
      io.to(rideId).emit("riderJoined", {
        displayName: displayName,
      });
    });

    // user left the ride
    socket.on("userLeft", async ({ rideId, displayName }) => {
      io.to(rideId).emit("riderLeft", {
        displayName: displayName,
      });
    });

    // rider sets I'm ready
    socket.on("riderReady", async ({ rideId, userId }) => {
      console.log("rider is ready!", { rideId, userId });

      const ride = await Ride.findById(rideId);
      if (!ride) return console.error("Ride not found:", rideId);

      const rider = ride.riders.find((r) => r.user.toString() === userId);
      if (!rider) return console.error("Rider not found in ride!");

      rider.ready = true;

      await ride.save();
      console.log("Rider status updated!");

      const updatedRide = await Ride.findById(rideId).populate(
        "riders.user",
        "email displayName"
      );
      console.log("Emitting updated riders status to room:", updatedRide.riders);
      io.to(rideId).emit("updatedRidersStatus", updatedRide.riders);
    });

    // rider not ready
    socket.on("riderNotReady", async ({ rideId, userId }) => {
      console.log("rider is not ready!", { rideId, userId });

      const ride = await Ride.findById(rideId);
      if (!ride) return console.error("Ride not found:", rideId);

      const rider = ride.riders.find((r) => r.user.toString() === userId);
      if (!rider) return console.error("Rider not found in ride!");

      rider.ready = false;

      await ride.save();
      console.log("Rider status updated!");

      const updatedRide = await Ride.findById(rideId).populate(
        "riders.user",
        "email displayName"
      );
      io.to(rideId).emit("updatedRidersStatus", updatedRide.riders);
    });

    // on user location update
    socket.on("userLocationUpdate", ({ rideId, userId, lat, lon }) => {
      console.log("Received location update on backend:", {
        rideId,
        userId,
        lat,
        lon,
      });
      // Broadcast location to everyone else in the ride room
      socket.to(rideId).emit("updateRiderLocation", {
        userId,
        lat,
        lon,
      });
      console.log("Broadcasted to ride room:", rideId);
    });

    // on admin stared the ride
    socket.on("adminStartedTheRide", ({ rideId }) => {
      console.log("Admin started the ride:", rideId);
      io.to(rideId).emit("rideStartedByAdmin");
    });

    // socket.on("leaveRide", ({ rideId, userId }) => {
    //   socket.leave(rideId);
    //   const userDetails = currentUserDetails;
    //   const rideDetails = currentRideDetails;

    //   if (rideDetails && userDetails) {
    //     io.to(rideDetails._id).emit("riderLeft", {
    //       userId: userDetails._id,
    //       displayName: userDetails.displayName,
    //     });
    //   }
    // });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}
