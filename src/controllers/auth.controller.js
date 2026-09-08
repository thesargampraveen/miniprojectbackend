const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const signToken = (user) =>
  jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'This email is already registered. Please login.' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      message: 'Account created successfully',
      token: signToken(user),
      user,
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      token: signToken(user),
      user,
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
}

module.exports = { register, login };
