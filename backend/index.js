import express from "express";
import { PORT, mongoURL } from "./config.js";
import mongoose from "mongoose";
import cors from "cors";
import userRoute from "./route/userRoute.js";
import drugRoute from "./route/drugRoute.js";
import logRoute from "./route/logRoute.js";
import scheduleRoute from "./route/scheduleRoute.js";
import { schedule } from "./models/scheduleModel.js";
import { Log } from "./models/logModel.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config({ path: "../config.env" });

//---------Config firebase---------------
import { initializeApp } from "firebase/app";
import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import admin from "firebase-admin";

const __dirname = dirname(fileURLToPath(import.meta.url));

let token;

async function initializeFirebase() {
  const jsonData = await readFile(
    join(__dirname, "hy-drug-tracker-firebase-adminsdk-c19wh-f26d98afba.json")
  );
  const serviceAccount = JSON.parse(jsonData);
  token = serviceAccount.private_key_id;
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

initializeFirebase()
  .then(() => {
    console.log("success FCM config");
  })
  .catch(console.error);

const firebaseConfig = {
  // apiKey: "AIzaSyDnPM-sLk8L_M6rZxWkU9LNBlYPtLqgizU",
  // authDomain: "hy-drug-tracker.firebaseapp.com",
  // projectId: "hy-drug-tracker",
  // storageBucket: "hy-drug-tracker.appspot.com",
  // messagingSenderId: "219645151152",
  // appId: "1:219645151152:web:121e861e16e8c241ecf875",
  // measurementId: "G-DWP00DV9NB",
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);

// --------------------------------------------

//

const app = express();

// Middleware to parse request body
app.use(express.json());
app.use(cookieParser());

// Import CORS
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.get("/", (req, res) => {
  return res.status(234).send("Successful connection!");
});

app.listen(PORT, () => {
  console.log(`APP is listning to port :${PORT}`);
});

app.use((req, res, next) => {
  // console.log(req.cookies);
  next();
});

//  Basic Routeing
app.use("/users", userRoute);
app.use("/drugs", drugRoute);
app.use("/logs", logRoute);
app.use("/schedules", scheduleRoute);

// connection to DB
mongoose
  .connect(mongoURL, {})
  .then(() => {
    console.log("connected with DB successfully!");
    // Watch the schedule document to send the reminder based on the log
    schedule
      .watch([{ $match: { operationType: "delete" } }])
      .on("change", async (data) => {
        const id = data.documentKey._id;
        const log = await Log.findOne({ _id: id })
          .populate("drugId")
          .populate("userId");
        console.log(log);
        const payload = {
          notification: {
            title: "It's time to take medicine💊",
            body: `${log.drugId.drugName} || Scheduled at ${log.plannedDateTime}`,
          },
          token: log.userId.fcm,
          data: {
            userId: `${log.userId._id}`,
          },
        };
        console.log(payload, `${log.userId._id}`);
        admin
          .messaging()
          .send(payload)
          .then((res) => {
            console.log("push sent successfully", res);
          })
          .catch((err) => {
            console.log(err);
            if (err.errorInfo) {
              console.log(err.errorInfo);
            }
          });
      });
  })
  .catch((error) => {
    console.log(error);
  });
