import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import SearchDrug from "./SearchDrug.jsx";
import { useAuthContext } from "../authContext.js";
// import { userId } from "../App.js";
import Footer from "../components/Footer.jsx";

function Setting() {
  const userIdObj = useAuthContext();
  const userId = userIdObj.userId;
  const [user, setUser] = useState({});
  const [isNotificationSettingOpen, setIsNotificationSettingOpen] =
    useState(false);
  const [isProfileSettingOpen, setisProfileSettingOpen] = useState(false);

  console.log(userId);

  const navigate = useNavigate();

  // Read user info
  useEffect(() => {
    if (userId) {
      axios.get(`https://hy-server.vercel.app/users/${userId}`).then((res) => {
        console.log(res);
        setUser(res.data.data.user);
      });
    }
  }, [userIdObj]);

  // Logout
  const { logout } = useAuthContext();
  const handleSubmit = (e) => {
    console.log("logged out");
    logout();
    navigate("/login");
  };

  return (
    <>
      <header className="pt-2.5 relative h-[54px] bg-white ">
        <h1 className="font-semibold text-lg text-center">
          {isNotificationSettingOpen
            ? "Notifications"
            : isProfileSettingOpen
            ? "Profile"
            : "Settings"}
        </h1>
        {!isNotificationSettingOpen && !isProfileSettingOpen ? (
          ""
        ) : (
          <img
            src="/images/arrow_back_ios.png"
            className="w-6 absolute top-[50%] translate-y-[-50%] left-4 cursor-pointer"
            onClick={() => {
              if (isNotificationSettingOpen) {
                setIsNotificationSettingOpen(false);
              }
              if (isProfileSettingOpen) {
                setisProfileSettingOpen(false);
              }
            }}
          />
        )}
      </header>
      {!isNotificationSettingOpen && !isProfileSettingOpen ? (
        <div className="background bg-primary-100 h-[120vh]">
          <div className="setting-front py-6 flex flex-col gap-[7px]">
            <div
              className="notification mx-4 p-4 h-[56px]  bg-white grid grid-cols-[auto_1fr] gap-2 relative cursor-pointer"
              onClick={() => setIsNotificationSettingOpen(true)}
            >
              <img src="/images/Notification.png" alt="" className="w-6" />
              <p className="text-gray-950 text-[16.88px] font-medium">
                Notifications
              </p>
              <img
                src="/images/arrow_back_ios-1.png"
                alt=""
                className="w-6 absolute top-[50%] right-[16px] translate-y-[-50%]"
              />
            </div>
            <div
              className="notification mx-4 p-4 h-[56px]  bg-white grid grid-cols-[auto_1fr] gap-2 relative cursor-pointer"
              onClick={() => setisProfileSettingOpen(true)}
            >
              <img src="/images/Profile.png" alt="" className="w-6" />
              <p className="text-gray-950 text-[16.88px] font-medium">
                Profile{" "}
              </p>
              <img
                src="/images/arrow_back_ios-1.png"
                alt=""
                className="w-6 absolute top-[50%] right-[16px] translate-y-[-50%]"
              />
            </div>
            <div className="mt-4 flex justify-center">
              {" "}
              <p
                className="text-[18.99px] text-gray-500 cursor-pointer inline-block"
                onClick={(e) => handleSubmit(e)}
              >
                Log out
              </p>
            </div>
          </div>{" "}
        </div>
      ) : (
        ""
      )}

      {isNotificationSettingOpen ? (
        <Notification user={user} userId={userId} />
      ) : (
        ""
      )}
      {isProfileSettingOpen ? <Profile user={user} userId={userId} /> : ""}
      <Footer />
    </>
  );
}

export default Setting;

function Notification({ user, userId }) {
  const [reminder, setreminder] = useState(user.reminder);

  const handleToggle = () => {
    setreminder(!reminder);
    console.log(userId);
    axios
      .patch(`https://hy-server.vercel.app/users/${userId}`, {
        reminder: !reminder,
      })
      .then(() => console.log("success"));
    //   };
  };

  return (
    <>
      <div className="background bg-primary-100 h-[120vh]">
        {console.log(reminder)}
        <div className="setting-front py-6 flex flex-col gap-[7px]">
          <div
            className="notification mx-4 p-4 h-[56px]  bg-white grid grid-cols-[1fr_auto] gap-2 relative cursor-pointer"
            // onClick={() => setIsNotificationSettingOpen(true)}
          >
            <p className="text-gray-950 text-[16.88px] font-medium">
              Notifications
            </p>
            <input
              id="toggle"
              type="checkbox"
              checked={reminder ? true : false}
              className="absolute left-0 top-0 w-full h-full z-10 opacity-0 cursor-pointer peer"
              onChange={() => handleToggle()}
            />
            <label
              htmlFor="toggle"
              className="w-[32px] h-[14px] bg-slate-500 relative inline-block rounded-[40px] transition-all box-border after:content-[''] top-[50%] translate-y-[-50%] after:absolute after:w-[20px] after:h-[20px] after:rounded-[100px] after:left-[-10%] after:top-[-25%] after:z-[2] after:bg-white after:shadow-md peer-checked:bg-primary-700 peer-checked:after:left-[50%] peer-checked:transition-all"
            ></label>
          </div>
        </div>{" "}
      </div>
    </>
  );
}

function Profile({ user, userId }) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [middleName, setMiddleName] = useState(user.middleName);
  const [lastName, setLastName] = useState(user.lastName);
  const [gender, setGender] = useState(user.gender);
  const [dateofbirth, setDateofbirth] = useState(user.dateofbirth);

  const handleSaveChanges = () => {
    const data = {
      firstName,
      middleName,
      lastName,
      gender,
      dateofbirth,
    };
    axios
      .patch(`https://hy-server.vercel.app/users/${userId}`, data)
      .then(() => console.log("success"));
  };

  return (
    <>
      <div className="background bg-primary-100 h-[100vh]">
        <div className="setting-front py-6 flex flex-col mx-14">
          <div className="firstName mt-4 flex flex-col gap-2">
            <label className="text-[11px] text-gray-700">First Name</label>
            <input
              type="text"
              className="border-2 border-gray-400	rounded-md	w-full h-14 px-3 self-center text-gray-700 text-base"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="middleName mt-4 flex flex-col gap-2">
            <label className="text-[11px] text-gray-700">Middle Name</label>
            <input
              type="text"
              className="border-2 border-gray-400	rounded-md	w-full h-14 px-3 self-center text-gray-700 text-base"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
            />
          </div>
          <div className="lastName mt-4 flex flex-col gap-2">
            <label className="text-[11px] text-gray-700">Last Name</label>
            <input
              type="text"
              className="border-2 border-gray-400	rounded-md	w-full h-14 px-3 self-center text-gray-700 text-base"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="gender mt-4 flex flex-col gap-2">
            <label className="text-[11px] text-gray-700">Gender</label>
            <select
              type="text"
              className="border-2 border-gray-400	rounded-md	w-full h-14 px-3 self-center text-gray-700 text-base"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
            </select>
          </div>
          <div className="date-of-birth mt-4 flex flex-col gap-2">
            <label className="text-[11px] text-gray-700">Date of birth</label>
            <input
              type="text"
              className="border-2 border-gray-400	rounded-md	w-full h-14 px-3 self-center text-gray-700 text-base"
              value={dateofbirth}
              onChange={(e) => {
                setDateofbirth(e.target.value);
              }}
            />
          </div>
          <div className="next_name mt-[100px]">
            <button
              className="mt-10 text-base text-gray-50 font-semibold rounded-3xl bg-primary-700 w-full h-12"
              onClick={() => handleSaveChanges()}
            >
              Save
            </button>
          </div>
        </div>{" "}
      </div>
    </>
  );
}
