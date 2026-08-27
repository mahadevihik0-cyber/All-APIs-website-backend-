const express = require('express');
const { forwardRequest } = require('../controllers/requestController');
const router = express.Router();
router.post('/', forwardRequest);
module.exports = router;
