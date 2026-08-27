const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
exports.auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) throw new Error();
    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
exports.ownerOnly = (req, res, next) => {
  if (req.admin.role !== 'owner') return res.status(403).json({ error: 'Owner only' });
  next();
};
