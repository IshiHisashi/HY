import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks.js";
import { useAuthContext } from "../authContext.js";
import SignUp from "./SignUp.jsx";

const Login = () => {
  const [em, setEm] = useState("");
  const [pw, setPw] = useState("");
  const [signup, setSignup] = useState(false);
  const { login } = useAuthContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
    const email = em;
    const password = pw;
    axios.defaults.withCredentials = true;

    login({ email, password });
  };

  return (
    <>
      {!signup ? (
        <div className="login-screen">
          <div className="flex flex-col gap-4 mt-[100px]">
            <img
              src="./images/logo/logo.png"
              alt="logo"
              className="w-[56px] mx-auto"
            />
            <h1 className="text-3xl font-bold	text-primary-950 text-center">
              PillBook
            </h1>
          </div>
          <div className="login-form mt-14 mx-4">
            <div className="email">
              <label className="block text-xs font-medium	text-gray-700">
                Email
              </label>
              <input
                className="text-gray-500 border-2 border-gray-400	rounded-md	w-full h-14 pl-3 mt-1.5	"
                type="text"
                placeholder="e.g abcdef@pillbook.com"
                onChange={(e) => setEm(e.target.value)}
              />
            </div>
            <div className="password mt-4">
              <label className="block text-xs font-medium	text-gray-700">
                Password
              </label>
              <input
                className="text-gray-500 border-2 border-gray-400	rounded-md w-full h-14 pl-3 mt-1.5	"
                type="password"
                placeholder="e.g Banana"
                onChange={(e) => setPw(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1 ml-3">
                {/* More than 8 letters includes at least one uppsercase letter */}
              </p>
            </div>
            <br></br>
            <button
              className="mt-10 text-base text-gray-50 font-semibold	 rounded-3xl bg-primary-700 w-full h-12"
              onClick={(e) => handleSubmit(e)}
            >
              Login
            </button>
            <p className="my-3.5 text-base text-gray-800 font-normal text-center cursor-pointer	">
              {/* Forget password */}
            </p>
            <button
              className="mt-28 text-base text-primary-700 font-semibold border-2 rounded-3xl border-primary-700 bg-white w-full h-12"
              onClick={() => setSignup(true)}
            >
              Sign Up Free Accont
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
      {signup ? <SignUp email={em} password={pw} setSignup={setSignup} /> : ""}

      <div className="mt-4 text-center">
        <Link to="/">Home</Link>
      </div>
    </>
  );
};

export default Login;
