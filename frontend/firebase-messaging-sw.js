import { messaging } from "./src/App.js";
import { onBackgroundMessage } from "firebase/messaging";

// onMessage(messaging, (payload) => {
//   console.log("Message received. ", payload);
//   // ...
// });

onBackgroundMessage(messaging, (payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
