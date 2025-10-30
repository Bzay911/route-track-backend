import Ride from "../src/models/ride.js";

export default function setupRideSockets(io) {
  // listening for riders connection
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // join a ride room
    socket.on("joinRide", (rideId) => {
      socket.join(rideId);
      console.log(`Socket ${socket.id} joined ride ${rideId}`);
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

       const updatedRide = await Ride.findById(rideId).populate("riders.user", "email displayName");
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

      const updatedRide = await Ride.findById(rideId).populate("riders.user", "email displayName");
      io.to(rideId).emit("updatedRidersStatus", updatedRide.riders);
    });

    // on user location update
    socket.on("userLocationUpdate", ({rideId, userId, lat, lon}) => {
      // Broadcast location to everyone else in the ride room
      socket.to(rideId).emit("updateRiderLocation", {
        userId, lat, lon
      })
    })

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}
