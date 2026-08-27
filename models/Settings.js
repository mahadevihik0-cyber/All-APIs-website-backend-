const mongoose = require('mongoose');
const settingsSchema = new mongoose.Schema({
  maintenanceMode: { type: Boolean, default: false },
  updatingMode: { type: Boolean, default: false },
  discordLink: String,
  githubLink: String,
  instagramLink: String,
  youtubeLink: String
});
module.exports = mongoose.model('Settings', settingsSchema);
