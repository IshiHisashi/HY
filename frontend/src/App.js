import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Switch } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Logout from "./pages/Logout.jsx";
import CreateDrug from "./pages/CreateDrug.jsx";
import DeleteDrug from "./pages/DeleteDrug.jsx";
import EditDrug from "./pages/EditDrug.jsx";
import DetailDrug from "./pages/DetailDrug.jsx";
import ViewDrug from "./pages/ViewDrug.jsx";
import Setting from "./pages/Setting.jsx";
import { useAuthContext } from "./authContext.js";
// require("dotenv").config();

// Firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import SignUp from "./pages/SignUp.jsx";

// Specify userID

export let userId;

console.log(userId);

const firebaseConfig = {
  apiKey: "AIzaSyDnPM-sLk8L_M6rZxWkU9LNBlYPtLqgizU",
  authDomain: "hy-drug-tracker.firebaseapp.com",
  projectId: "hy-drug-tracker",
  storageBucket: "hy-drug-tracker.appspot.com",
  messagingSenderId: "219645151152",
  appId: "1:219645151152:web:121e861e16e8c241ecf875",
  measurementId: "G-DWP00DV9NB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = await getMessaging(app);
//

const vapidKey =
  "BIGHLUsIKPHRiT7ISIA8DquI6O5bK6xZ4DomZISS3TtmHg_rA7fUDMwfWF17TM8hzSB_ogxYvuwy3wRDo_TnZRA";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+") // Replace - with +
    .replace(/_/g, "/"); // Replace _ with /

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// SW
if ("Notification" in window && "serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("../firebase-messaging-sw.js")
    .then(function (registration) {
      console.log("Registration successful, scope is:", registration.scope);
      registration.update();
      return navigator.serviceWorker.ready;
    })
    .then(function (registration) {
      console.log("ok up until this point");
      // Now that the Service Worker is ready, proceed to subscribe the user
      const applicationServerKey = urlBase64ToUint8Array(vapidKey);

      // reload until service worker take controll the page
      console.log(navigator.serviceWorker.controller);
      if (navigator.serviceWorker.controller) {
        console.log("Service Worker is active and controlling the page.");
      } else {
        console.log("Service Worker is not controlling the page.");
        window.location.reload();
      }
      // Then, subscribe
      return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey,
      });
    })
    .then(function (subscription) {
      console.log("User is subscribed:", subscription);
    })
    .then(function () {
      console.log("permission requested");
    })
    .catch(function (err) {
      console.log("Service worker registration failed, error:", err);
    });
}

async function save(userId) {
  console.log(userId);
  const fcm_token = await getToken(messaging, {
    vapidKey,
  });
  // Receive
  onMessage(messaging, (payload) => {
    if (payload.data.userId === userId) {
      console.log("Message received. ", payload);
      new Notification(payload.notification.title, {
        body: payload.notification.body,
      });
    }
  });
}

export const fcm_token = await getToken(messaging, {
  vapidKey,
});
console.log(fcm_token);

// ----------------------------------------------------

// Routing
function App() {
  const userIdObj = useAuthContext();
  const userId = userIdObj.userId;
  // const [userId, setUserId] = useState(userIdObj.userId);
  console.log(userId);

  // Notification

  function requestPermission(userId) {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
          // insert fnc
          save(userId);
          // insert end
        }
      });
    } else {
      console.log("this browser does not support notifications");
    }
  }
  requestPermission(userId);

  return (
    <div>
      {!userId || userId === "logout" ? (
        <Routes>
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/*" element={<Login />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/drugs/create" element={<CreateDrug />} />
          <Route path="/drugs/view" element={<ViewDrug />} />
          <Route path="/drugs/delete/:id" element={<DeleteDrug />} />
          <Route path="/drugs/edit/:id" element={<EditDrug />} />
          <Route path="/drugs/detail/:id" element={<DetailDrug />} />
          <Route path="/setting" element={<Setting />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
