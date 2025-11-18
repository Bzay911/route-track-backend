import { Expo } from "expo-server-sdk";

let expo = new Expo();

export async function sendPushNotification(
  expoPushToken,
  title,
  body,
  data = {}
) {
  if (!expoPushToken) {
    console.log("Push token is required!");
    return {
      success: false,
      message: "Push token is required!",
    };
  }

  if (!title || !body) {
    console.error("Title and body are required!");
    return {
      success: false,
      message: "Title and body are required!",
    };
  }

  if (!Expo.isExpoPushToken(expoPushToken)) {
    console.log("Invalid Expo push token:", expoPushToken);
    return{
      success: false,
      message: 'Invalid expo push token!'
    }
  }

  const messages = [
    {
      to: expoPushToken,
      sound: "default",
      title: title,
      body: body,
      data: data,
      priority: 'high'
    },
  ];
  
  try {
    let ticketChunk = await expo.sendPushNotificationsAsync(messages);
    console.log("Notification ticket:", ticketChunk);
    return ticketChunk;
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}
