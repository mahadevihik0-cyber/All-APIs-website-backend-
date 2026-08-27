const Settings = require('../models/Settings');
exports.getSettings = async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  res.json(settings);
};
exports.updateSettings = async (req, res) => {
  const updates = req.body;
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create(updates);
  else settings = await Settings.findByIdAndUpdate(settings._id, updates, { new: true });
  res.json(settings);
};
