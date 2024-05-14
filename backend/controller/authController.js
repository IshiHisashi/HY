import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import { promisify } from "util";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const cookieOptions = {
  expires: new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 3600 * 1000
  ),
  httpOnly: true,
  secure: true,
  sameSite: "None",
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  //   if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);
  // Remove the password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const signup = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const login = async (req, res, next) => {
  try {
    // console.log(req.body);
    const { email, password } = req.body;
    //   1) Check if email and password exists
    if (!email || !password) {
      return next(new AppError("Please provide email and password"), 400);
    }
    //   2) Check if user exists and password is correct
    const user = await User.findOne({ email: email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password"), 401);
    }

    //   3) If everyighing is ok, send token to client
    createSendToken(user, 200, res);
    console.log("doing login");
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Get & save user id after login. This is routed as '/loggedinuser'.
export const user = (req, res) => {
  console.log(req.cookies);
  const token = req.cookies.jwt;
  if (!token) {
    console.log("This is request");
    return res.status(400).json({ message: "Token does not exist" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    } else {
      console.log(decoded);
      req._id = decoded.id;
    }
  });

  const id = req._id;
  return res.status(200).json({ id });
};

// Middleware function to limit access
export const protect = async (req, res, next) => {
  // 1.Get the token and check the existence
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    console.log(req.cookies.jwt);
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError("You are not logged in!", 401));
  }

  // 2.Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(process.env.JWT_SECRET);
  // 3.Check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError(
        "The token belonging to this user does no longer exist.",
        401
      )
    );
  }
  // 4.Check if user changed password after the JWT was issued

  next();
};

//  Logout
export const revokeToken = async (req, res) => {
  console.log(req.cookies);
  // res.clearCookie("jwt");
  res.clearCookie("jwt", {
    path: "/",
    domain: "hy-server.vercel.app",
    secure: true,
    httpOnly: true,
    sameSite: "None",
  });
  res.status(200).json({ message: "cookies are deleted" });
};
