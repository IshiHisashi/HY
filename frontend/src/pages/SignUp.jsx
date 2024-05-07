import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { fcm_token } from "../App";
import { useAuthContext } from "../authContext.js";

const SignUp = ({ email, password, setSignup }) => {
  const { signup } = useAuthContext();

  // Auth container
  const [em, setEm] = useState(email);
  const [pw, setPw] = useState(password);
  // const [confirmpw, setConfirmpw] = useState("");

  // Input values
  const [firstN, setFirstName] = useState("");
  const [middleN, setMiddleName] = useState("");
  const [lastN, setLastName] = useState("");
  const [isfnSet, setIsfnSet] = useState(false);
  const [gen, setGen] = useState("non-binary");
  const [bd, setBd] = useState("");
  const [needReminder, setNeedReminder] = useState(false);
  const fcm = fcm_token;

  // States for registration Process
  const [progress, setProgress] = useState(1);
  const [reminderRegisater, setReminderRefister] = useState(false);

  const handleProgessAdd = () => {
    setProgress((progress) => progress + 1);
  };

  const handleProgessDec = () => {
    if (progress === 3) {
      setReminderRefister(false);
    }
    setProgress((progress) => progress - 1);
  };
  // name
  useEffect(() => {
    if (firstN.length > 0) {
      setIsfnSet(true);
    } else {
      setIsfnSet(false);
    }
  }, [firstN]);

  // notification
  const handleNotificationSet = () => {
    setReminderRefister(false);
    setNeedReminder(true);
    setProgress((progress) => progress + 1);
  };

  const handleNotificationSkip = () => {
    setReminderRefister(false);
    setProgress((progress) => progress + 1);
  };

  const handleSubmit = () => {
    setSignup(false);
    console.log("submitted");
    const firstName = firstN;
    const middleName = middleN;
    const lastName = lastN;
    const email = em;
    const password = pw;
    const gender = gen;
    const dateofbirth = bd;
    const reminder = needReminder;
    // const passwordConfirm = confirmpw;
    axios.defaults.withCredentials = true;
    console.log(
      firstName,
      middleName,
      lastName,
      email,
      password,
      gender,
      dateofbirth,
      reminder,
      // passwordConfirm,
      fcm
    );
    signup({
      firstName,
      middleName,
      lastName,
      email,
      password,
      gender,
      dateofbirth,
      reminder,
      // passwordConfirm,
      fcm,
    });
  };
  console.log(bd);

  return (
    <>
      <header className="mt-2.5">
        <h1 className="font-semibold text-lg text-center">Create Profile</h1>
        {progress > 1 ? (
          <button onClick={(progress) => handleProgessDec(progress)}>
            Previous
          </button>
        ) : (
          ""
        )}
      </header>
      {/* This will become "Name component" */}
      {progress === 1 ? (
        <div className="name-wrapper">
          <div className="text-wrapper mx-4 mt-10  text-primary-950">
            <h2 className="text-2xl font-bold">What is your name?</h2>
            <p className="text-base mt-3">
              Your name will be on the medication history.<br></br>Please tell
              us your official name. <br></br>You can edit your name later on
              the settings.{" "}
            </p>
            <p className="text-xs mt-1 text-primary-700 font-normal">
              * Required
            </p>
          </div>
          <div className="form mx-4 mt-8">
            <div className="name mt-4">
              <label className="block text-xs font-medium	text-gray-700">
                First Name<span className="ml-1 text-primary-700">*</span>
              </label>
              <input
                className="text-gray-500 border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-1.5	"
                type="text"
                placeholder="e.g Strawnana"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="name mt-4">
              <label className="block text-xs font-medium	text-gray-700">
                Middle Name
              </label>
              <input
                className="text-gray-500 border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-1.5	"
                type="text"
                placeholder="e.g Strawnana"
                onChange={(e) => setMiddleName(e.target.value)}
              />
            </div>
            <div className="name mt-4">
              <label className="block text-xs font-medium	text-gray-700">
                Last Name
              </label>
              <input
                className="text-gray-500 border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-1.5	"
                type="text"
                placeholder="e.g Strawnana"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <br></br>
            <div className="next_name mt-[187px]">
              {isfnSet ? (
                <button
                  onClick={(progress) => handleProgessAdd(progress)}
                  className={`mt-10 text-base text-gray-50 font-semibold	 rounded-3xl bg-primary-700 w-full h-12 
                }`}
                >
                  Next
                </button>
              ) : (
                <button
                  className={`mt-10 text-base text-gray-50 font-semibold	 rounded-3xl bg-primary-700 opacity-40 w-full h-12 
            }`}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {/* This will become "Gender component" */}
      {progress === 2 ? (
        <div className="gender-wrapper">
          <div className="text-wrapper mx-4 mt-10  text-primary-950">
            <h2 className="text-2xl font-bold">What is your gender?</h2>
            <p className="text-base mt-3">
              Your gender will be on the medication history.<br></br>
              You can edit your name later on the settings.
            </p>
          </div>
          <div className="form mx-4 mt-8">
            <div className="name mt-4">
              <label className="block text-xs font-medium	text-gray-700">
                Gender
              </label>
              <div>
                <input
                  type="radio"
                  value="male"
                  name="gender"
                  id="male"
                  className="sr-only	peer"
                  onClick={(e) => setGen(e.target.value)}
                />
                <label
                  htmlFor="male"
                  className={`border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-2	flex items-center	cursor-pointer peer-checked:bg-primary-700 peer-checked:text-gray-50 peer-checked:border-0`}
                >
                  Male
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  value="female"
                  name="gender"
                  id="female"
                  className="sr-only	peer"
                  onClick={(e) => setGen(e.target.value)}
                />
                <label
                  htmlFor="female"
                  className={`border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-2	flex items-center	cursor-pointer  peer-checked:bg-primary-700 peer-checked:text-gray-50 peer-checked:border-0`}
                >
                  Female
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  value="non-binary"
                  name="gender"
                  id="non-binary"
                  className="sr-only	peer"
                  onClick={(e) => setGen(e.target.value)}
                />
                <label
                  htmlFor="non-binary"
                  className={`border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-2	flex items-center	cursor-pointer  peer-checked:bg-primary-700 peer-checked:text-gray-50 peer-checked:border-0`}
                >
                  Non-binary
                </label>
              </div>
            </div>

            <div className="next_name mt-[369px]">
              <button
                className="mt-10 text-base text-gray-50 font-semibold	 rounded-3xl bg-primary-700 w-full h-12"
                onClick={(progress) => handleProgessAdd(progress)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {/* This will become "Birthdate component" */}
      {progress === 3 ? (
        <div className="birthdate-wrapper">
          <div className="text-wrapper mx-4 mt-10  text-primary-950">
            <h2 className="text-2xl font-bold">What is your date of birth?</h2>
            <p className="text-base mt-3">
              Your gender will be on the medication history.<br></br>
              You can edit your name later on the settings.
            </p>
          </div>
          <div className="form mx-4 mt-8">
            {!reminderRegisater ? (
              <div className="name mt-4">
                <label className="block text-xs font-medium	text-gray-700">
                  Date of birth
                </label>
                <input
                  className="text-gray-500 border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-1.5	"
                  type="text"
                  placeholder="e.g May 20, 1980"
                  onChange={(e) => setBd(e.target.value)}
                ></input>
              </div>
            ) : (
              ""
            )}

            {!reminderRegisater ? (
              <div className="next_name mt-[369px]">
                <button
                  className="mt-10 text-base text-gray-50 font-semibold	 rounded-3xl bg-primary-700 w-full h-12
              "
                  onClick={() => setReminderRefister(true)}
                >
                  Next
                </button>
              </div>
            ) : (
              <div className="reminder-register-wrapper mt-48 rounded-t-2xl ">
                <img
                  src="./images/reminderRegistration.png"
                  className="mx-auto"
                />
                <h3 className="text-primary-950 text-[21.36px] font-semibold text-center mt-[35px]">
                  Do you want reminders?
                </h3>
                <p className="text-primary-950 text-base text-center mt-2">
                  You can change it later on the settings.
                </p>
                <button
                  className="mt-10 text-base text-gray-50 font-semibold	 rounded-3xl bg-primary-700 w-full h-12"
                  onClick={() => handleNotificationSet()}
                >
                  Turn on Notifications
                </button>
                <p
                  className="mt-[14.5px] text-base text-gray-800 text-center cursor-pointer"
                  onClick={() => handleNotificationSkip()}
                >
                  Skip
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
      {/* This will become "Welcome" */}
      {progress === 4 ? (
        <div className="welcome-wrapper mt-[159px] mx-4">
          <img src="./images/welcome.png" className="mx-auto" />
          <div className="text-wrapper mx-4 mt-[23px]  text-primary-950">
            <h2 className="text-primary-950 text-2xl font-bold text-center">
              Welcome to PillBook
            </h2>
            <p className="text-primary-950 text-base mt-3 text-center">
              Completed creating your account.
            </p>
          </div>
          <button
            className="mt-[183px] text-base text-gray-50 font-semibold rounded-3xl bg-primary-700 w-full h-12
              "
          >
            <Link to="/drugs/create">Add an Medication</Link>
          </button>
          <p className="mt-[14.5px] text-base text-gray-800 text-center">
            <Link to="/">Skip</Link>
          </p>
        </div>
      ) : (
        ""
      )}
      <button onClick={handleSubmit}>handleSubmit</button>
    </>
  );
};

export default SignUp;
