// import { messaging } from "./src/App.js";
// import { onBackgroundMessage } from "firebase/messaging";

importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyDnPM-sLk8L_M6rZxWkU9LNBlYPtLqgizU",
  authDomain: "hy-drug-tracker.firebaseapp.com",
  projectId: "hy-drug-tracker",
  storageBucket: "hy-drug-tracker.appspot.com",
  messagingSenderId: "219645151152",
  appId: "1:219645151152:web:121e861e16e8c241ecf875",
  measurementId: "G-DWP00DV9NB",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  {
    self.registration.showNotification(notificationTitle, notificationOptions);
  }
});

self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
  self.skipWaiting(); // Forces the waiting Service Worker to become the active Service Worker
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
  event.waitUntil(self.clients.claim()); // Takes control of the page as soon as it's activated
});
