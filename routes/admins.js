const express = require('express');
const { getAllAdmins, createAdmin, deleteAdmin } = require('../controllers/adminController');
const { auth, ownerOnly } = require('../middleware/auth');
const router = express.Router();
router.use(auth, ownerOnly);
router.get('/', getAllAdmins);
router.post('/', createAdmin);
router.delete('/:id', deleteAdmin);
module.exports = router;
