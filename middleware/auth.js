import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        message: 'Not authorized, no token',
        code: 'NO_TOKEN'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password -refreshToken');
      
      if (!req.user) {
        return res.status(401).json({ 
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Token expired',
          code: 'TOKEN_EXPIRED'
        });
      }
      throw jwtError;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      message: 'Not authorized, token failed',
      code: 'TOKEN_INVALID'
    });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      message: 'Not authorized as admin',
      code: 'ADMIN_REQUIRED'
    });
  }
};

export const premium = (req, res, next) => {
  if (req.user && (req.user.isPremium || req.user.role === 'admin')) {
    
    if (req.user.isPremium && req.user.premiumExpiresAt) {
      if (new Date() > req.user.premiumExpiresAt) {
        return res.status(403).json({ 
          message: 'Premium subscription expired',
          code: 'PREMIUM_EXPIRED'
        });
      }
    }
    next();
  } else {
    res.status(403).json({ 
      message: 'Premium subscription required',
      code: 'PREMIUM_REQUIRED'
    });
  }
};