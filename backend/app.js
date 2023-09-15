const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const auth = require('./src/auth'); // Import the authentication module
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
app.use(auth.initializePassport()); // Initialize Passport.js
app.use(auth.session()); // Enable session management

// Login route using the local authentication strategy
app.post('/login', auth.authenticateLocal(), (req, res) => {
  res.json({ message: 'Authentication successful' });
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout();
  res.json({ message: 'Logout successful' });
});

// Protected route
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
}

app.get('/profile', ensureAuthenticated, (req, res) => {
  res.json({ message: 'Welcome to the profile page' });
});

// Start the Express app
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
