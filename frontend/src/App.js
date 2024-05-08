import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Logout from "./pages/Logout.jsx";
import CreateDrug from "./pages/CreateDrug.jsx";
import DeleteDrug from "./pages/DeleteDrug.jsx";
import EditDrug from "./pages/EditDrug.jsx";
import DetailDrug from "./pages/DetailDrug.jsx";
import ViewDrug from "./pages/ViewDrug.jsx";
import Setting from "./pages/Setting.jsx";
// require("dotenv").config();

// Firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import SignUp from "./pages/SignUp.jsx";

// Specify userID
export let userId = "66245b3e7457e717dc5a8294";

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
// Notification
// SW
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("../firebase-messaging-sw.js")
    .then(function (registration) {
      console.log("Registration successful, scope is:", registration.scope);
    })
    .catch(function (err) {
      console.log("Service worker registration failed, error:", err);
    });
}
async function save(userId) {
  const fcm_token = await getToken(messaging, {
    vapidKey:
      "BIGHLUsIKPHRiT7ISIA8DquI6O5bK6xZ4DomZISS3TtmHg_rA7fUDMwfWF17TM8hzSB_ogxYvuwy3wRDo_TnZRA",
  });

  // Receive
  onMessage(messaging, (payload) => {
    if (payload.data.userId !== userId) {
      console.log("Message received. ", payload);
      new Notification(payload.notification.title, {
        body: payload.notification.body,
      });
    }
  });
}

export const fcm_token = await getToken(messaging, {
  vapidKey:
    "BIGHLUsIKPHRiT7ISIA8DquI6O5bK6xZ4DomZISS3TtmHg_rA7fUDMwfWF17TM8hzSB_ogxYvuwy3wRDo_TnZRA",
});
console.log(fcm_token);

export function requestPermission(userId) {
  // console.log("Requesting permission...");
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
      // insert fnc
      save(userId);
      // insert end
    }
  });
}
requestPermission();

// ----------------------------------------------------

// Routing
function App() {
  return (
    <div>
      {/* <h1 className="text-3xl font-bold underline">Hello from frontend</h1> */}
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
    </div>
  );
}

export default App;
