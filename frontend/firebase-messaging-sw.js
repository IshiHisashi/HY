// import { messaging } from "./src/App.js";
// import { onBackgroundMessage } from "firebase/messaging";

// // onMessage(messaging, (payload) => {
// //   console.log("Message received. ", payload);
// //   // ...
// // });

// onBackgroundMessage(messaging, (payload) => {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message ",
//     payload
//   );
//   // Customize notification here
//   const notificationTitle = "Background Message Title";
//   const notificationOptions = {
//     body: "Background Message body.",
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

// self.addEventListener("install", (event) => {
//   console.log("Service Worker installing.");
//   self.skipWaiting(); // Forces the waiting Service Worker to become the active Service Worker
// });

// self.addEventListener("activate", (event) => {
//   console.log("Service Worker activating.");
//   event.waitUntil(self.clients.claim()); // Takes control of the page as soon as it's activated
// });

// self.addEventListener("fetch", (event) => {
//   console.log("Service Worker fetching:", event.request.url);
//   // Here you can add how you want to respond to fetch events
// });
