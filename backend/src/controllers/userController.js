import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncHandler from 'express-async-handler'; 

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid username or password.");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(400);
    throw new Error('Username already taken.');
  }

  const user = await User.create({
    username,
    password, 
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id), 
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});


export { loginUser, registerUser }; 