const API = require('../models/API');

function extractParametersFromEndpoint(endpoint) {
  const paramSet = new Set();
  const regex = /\{([^}]+)\}/g;
  let match;
  while ((match = regex.exec(endpoint)) !== null) {
    paramSet.add(match[1]);
  }
  return Array.from(paramSet).map(name => ({
    name,
    type: 'string',
    required: true,
    in: 'query',
    description: 'Auto-detected from endpoint'
  }));
}

exports.getAllAPIs = async (req, res) => {
  const apis = await API.find().populate('createdBy', 'username');
  res.json(apis);
};

exports.getAPIById = async (req, res) => {
  const api = await API.findById(req.params.id).populate('createdBy', 'username');
  if (!api) return res.status(404).json({ error: 'API not found' });
  res.json(api);
};

exports.createAPI = async (req, res) => {
  const { name, description, endpoint, method, parameters, headers } = req.body;
  if (!name || !endpoint || !method) return res.status(400).json({ error: 'Missing fields' });
  let finalParameters = parameters;
  if (!finalParameters || finalParameters.length === 0) {
    finalParameters = extractParametersFromEndpoint(endpoint);
  }
  const api = await API.create({ name, description, endpoint, method, parameters: finalParameters, headers, createdBy: req.admin._id });
  res.status(201).json(api);
};

exports.updateAPI = async (req, res) => {
  const updates = { ...req.body };
  if (updates.endpoint && (!updates.parameters || updates.parameters.length === 0)) {
    updates.parameters = extractParametersFromEndpoint(updates.endpoint);
  }
  const api = await API.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!api) return res.status(404).json({ error: 'API not found' });
  res.json(api);
};

exports.deleteAPI = async (req, res) => {
  const api = await API.findByIdAndDelete(req.params.id);
  if (!api) return res.status(404).json({ error: 'API not found' });
  res.json({ message: 'API deleted' });
};
