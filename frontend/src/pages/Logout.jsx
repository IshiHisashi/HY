import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks.js";
import { useAuthContext } from "../authContext.js";

const Logout = () => {
  const { logout } = useAuthContext();
  const handleSubmit = (e) => {
    console.log("logged out");
    logout();
  };

  return (
    <>
      <Link to="/">Home</Link>

      <button onClick={(e) => handleSubmit(e)}>Logout</button>
    </>
  );
};

export default Logout;
