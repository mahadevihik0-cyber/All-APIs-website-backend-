const mongoose = require('mongoose');
const parameterSchema = new mongoose.Schema({
  name: String, type: { type: String, default: 'string' },
  required: { type: Boolean, default: false },
  in: { type: String, enum: ['query','body','header'], default: 'query' },
  description: String, default: String
});
const apiSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  endpoint: { type: String, required: true },
  method: { type: String, enum: ['GET','POST','PUT','DELETE','PATCH'], default: 'GET' },
  parameters: [parameterSchema],
  headers: [{ name: String, value: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('API', apiSchema);
