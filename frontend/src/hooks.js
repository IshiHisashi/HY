import React, { useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const [userId, setUserId] = useState();
  const navigate = useNavigate();

  const signup = async (data) => {
    try {
      await axios.post("http://localhost:5555/users/signup", data);
      await getUser();
    } catch (error) {
      console.log(error);
    }
  };

  // login
  const login = async (data) => {
    try {
      await axios.post("http://localhost:5555/users/login", data);
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
        "http://localhost:5555/users/loggedinuser"
      );
      const id = response.data.id;
      console.log(id);
      setUserId(id);
    } catch (error) {
      console.log("fail due :", error);
    }
  });
  console.log(userId);

  const logout = () => {
    setUserId("logout");
    axios.delete("http://localhost:5555/users/revoke_token");
  };

  return { userId, setUserId, signup, getUser, login, logout };
};

export default useAuth;
