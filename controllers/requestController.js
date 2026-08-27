const axios = require('axios');
const API = require('../models/API');
const RequestLog = require('../models/RequestLog');

exports.forwardRequest = async (req, res) => {
  const { apiId, params = {}, headers = {}, body = {} } = req.body;
  if (!apiId) return res.status(400).json({ error: 'apiId is required' });

  try {
    const api = await API.findById(apiId);
    if (!api) return res.status(404).json({ error: 'API not found' });

    // Merge static headers from API definition with incoming headers
    const finalHeaders = {
      ...api.headers.reduce((acc, h) => ({ ...acc, [h.name]: h.value }), {}),
      ...headers,
      'User-Agent': 'BhuwanAPIs-Proxy/1.0',
      'Accept': '*/*',
      'Origin': req.headers.origin || '',
    };

    const finalQuery = {};
    const finalBody = {};
    let finalEndpoint = api.endpoint;

    // Validate required parameters and replace placeholders
    for (const param of api.parameters) {
      const value = params[param.name];
      if (param.required && (value === undefined || value === null || value === '')) {
        return res.status(400).json({ error: `Missing required parameter: ${param.name}` });
      }
      if (value !== undefined && value !== null) {
        if (api.endpoint.includes(`{${param.name}}`)) {
          finalEndpoint = finalEndpoint.replace(new RegExp(`\\{${param.name}\\}`, 'g'), encodeURIComponent(value));
        } else {
          switch (param.in) {
            case 'query': finalQuery[param.name] = value; break;
            case 'body': finalBody[param.name] = value; break;
            case 'header': finalHeaders[param.name] = value; break;
          }
        }
      }
    }

    // Build final URL and append non‑placeholder query params
    const url = new URL(finalEndpoint);
    Object.entries(finalQuery).forEach(([k, v]) => url.searchParams.append(k, v));

    console.log(`[Proxy] ${api.method} ${url.toString()}`);

    // Make the request – accept all status codes
    const response = await axios({
      method: api.method,
      url: url.toString(),
      headers: finalHeaders,
      data: finalBody,
      validateStatus: () => true,
    });

    // Attempt to save log, but never let it crash the server
    try {
      await RequestLog.create({
        apiId: api._id,
        params,
        responseStatus: response.status,
      });
    } catch (logError) {
      console.error('Log save error:', logError.message);
    }

    // Normalize response – always send JSON
    let responseData;
    if (typeof response.data === 'string') {
      try {
        responseData = JSON.parse(response.data);
      } catch {
        responseData = { message: response.data };
      }
    } else {
      responseData = response.data;
    }

    // Send a clean JSON response with status and data
    return res.status(response.status).json({
      status: response.status,
      data: responseData,
    });
  } catch (error) {
    console.error('Proxy error:', error.message);
    return res.status(500).json({ error: 'Proxy request failed', details: error.message });
  }
};
