import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// -----------------------------
// TOKEN HELPERS
// -----------------------------
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE || '1h'
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d'
  });
};

// -----------------------------
// REGISTER
// -----------------------------
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPass,
      role: 'user',
      isPremium: false
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      accessToken: generateAccessToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------
// LOGIN
// -----------------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    // store refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPremium: user.isPremium
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------
// REFRESH TOKEN
// -----------------------------
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token missing' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = generateAccessToken(user._id);

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};

// -----------------------------
// LOGOUT
// -----------------------------
export const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(400).json({ message: 'User not found' });

    user.refreshToken = null;
    await user.save();

    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------
// GOOGLE OAUTH CALLBACK
// -----------------------------
export const googleCallback = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.user.email });

    if (!user) {
      user = await User.create({
        name: req.user.fullName,
        email: req.user.email,
        avatar: req.user.avatar,
        role: 'user'
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${accessToken}`);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
