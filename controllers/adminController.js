const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
exports.getAllAdmins = async (req, res) => {
  const admins = await Admin.find().select('-passwordHash');
  res.json(admins);
};
exports.createAdmin = async (req, res) => {
  const { username, password } = req.body;
  const existing = await Admin.findOne({ username });
  if (existing) return res.status(409).json({ error: 'Username exists' });
  const hash = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ username, passwordHash: hash, role: 'admin' });
  res.status(201).json({ id: admin._id, username: admin.username, role: admin.role });
};
exports.deleteAdmin = async (req, res) => {
  const admin = await Admin.findById(req.params.id);
  if (!admin) return res.status(404).json({ error: 'Not found' });
  if (admin.role === 'owner') return res.status(403).json({ error: 'Cannot delete owner' });
  await Admin.findByIdAndDelete(req.params.id);
  res.json({ message: 'Admin deleted' });
};
