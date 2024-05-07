import { User } from "../models/userModel.js";

export const createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const readUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(201).json({
      status: "success",
      numUsers: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const readUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: `due to ${err}`,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const result = await User.findByIdAndUpdate(req.params.id, req.body);
    if (!result) {
      return res.status(404).json({ message: "Book not found" });
    } else {
      return res.status(201).json({
        status: "success in updating",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Book not found" });
    } else {
      return res.status(201).json({
        status: "success in deleting",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
