const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function createAccount({ fullName, email, password }) {
  if (!email || !password || !fullName) {
    throw new Error('All fields are required');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword
  });

  const token = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '3600m' }
  );

  return { user, token };
}

async function login({ email, password }) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '3600m' }
  );

  return { user, token };
}

module.exports = { createAccount, login };
