const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { auth, ownerOnly } = require('../middleware/auth');
const router = express.Router();
router.get('/', getSettings);
router.put('/', auth, ownerOnly, updateSettings);
module.exports = router;
