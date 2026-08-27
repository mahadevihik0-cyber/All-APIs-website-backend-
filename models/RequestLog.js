const mongoose = require('mongoose');
const requestLogSchema = new mongoose.Schema({
  apiId: { type: mongoose.Schema.Types.ObjectId, ref: 'API' },
  params: Object,
  responseStatus: Number,
  timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model('RequestLog', requestLogSchema);
