import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "please provide your name"],
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  gender: {
    type: String,
  },
  dateofbirth: {
    type: Date,
  },
  reminder: {
    type: Boolean,
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email form"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    // select: false,
  },
  // passwordConfirm: {
  //   type: String,
  //   required: [true, "Please confirm your password"],
  //   validate: {
  //     validator: function (el) {
  //       return el === this.password;
  //     },
  //   },
  //   message: "Passwords are not the same",
  // },
  fcm: {
    type: String,
  },
});

// for Signup
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  // Hash the password
  this.password = await bcrypt.hash(this.password, 12);
  // this.passwordConfirm = undefined;
  next();
});

// forLogin
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export const User = mongoose.model("user", userSchema);
