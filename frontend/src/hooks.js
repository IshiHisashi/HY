import React, { useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const [userId, setUserId] = useState();
  const navigate = useNavigate();

  const signup = async (data) => {
    try {
      await axios.post("https://server.pillbook-hy.com/users/signup", data);
      await getUser();
    } catch (error) {
      console.log(error);
    }
  };

  // login
  const login = async (data) => {
    try {
      await axios.post("https://server.pillbook-hy.com/users/login", data);
      await getUser();
      console.log("loggedin");
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = useCallback(async () => {
    console.log("get user is called");
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get(
        "https://server.pillbook-hy.com/users/loggedinuser"
      );
      const id = response.data.id;
      // console.log(id);
      setUserId(id);
    } catch (error) {
      console.log("fail due :", error);
    }
  });
  console.log(userId);

  const logout = () => {
    setUserId("logout");
    axios.delete("https://server.pillbook-hy.com/users/revoke_token");
    document.cookie =
      "jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=None";
  };

  return { userId, setUserId, signup, getUser, login, logout };
};

export default useAuth;
