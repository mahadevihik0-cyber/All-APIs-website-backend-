const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admins', require('./routes/admins'));
app.use('/api/apis', require('./routes/apis'));
app.use('/api/request', require('./routes/request'));
app.use('/api/settings', require('./routes/settings'));
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('MongoDB connected');
  const Admin = require('./models/Admin');
  const existingOwner = await Admin.findOne({ role: 'owner' });
  if (!existingOwner) {
    const hash = await bcrypt.hash('bhuwan123@', 10);
    await Admin.create({ username: 'bhuwan', passwordHash: hash, role: 'owner' });
    console.log('Owner account created: bhuwan / bhuwan123@');
  }
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error('MongoDB connection error:', err));
