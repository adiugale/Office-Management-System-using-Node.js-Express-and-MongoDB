require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static Files
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Error:", err));

// ROUTES (SAFE LOAD)
try {
  const departmentRoutes = require('./routes/departmentRoutes');
  app.use('/departments', departmentRoutes);
} catch (err) {
  console.log("Department routes not ready yet");
}

try {
  const employeeRoutes = require('./routes/employeeRoutes');
  app.use('/employees', employeeRoutes);
} catch (err) {
  console.log("Employee routes not ready yet");
}

// Home Route (SAFE)
app.get('/', (req, res) => {
  res.redirect('/employees/view');
});

// Server Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});