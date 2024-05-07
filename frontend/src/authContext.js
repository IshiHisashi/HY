import { createContext, useContext, useEffect } from "react";
import axios from "axios";
import useAuth from "./hooks.js";
const AuthContext = createContext();

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const { userId, setUserId, signup, getUser, login, logout } = useAuth();

  useEffect(() => {
    axios.defaults.withCredentials = true;
    if (userId !== "logout") {
      getUser();
    }
    console.log(userId);
  }, [getUser]);

  const value = {
    userId,
    getUser,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
