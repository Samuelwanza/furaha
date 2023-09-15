
const db=require("./db/connection.js")
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Configure Passport.js for local (username/password) authentication
passport.use(
  new LocalStrategy((username, password, done) => {
    const connection = db.getConnection();

    // Replace with your actual authentication logic here
    try {
        // Execute a raw SQL query to retrieve the user by username
        const [rows] = connection.execute('SELECT * FROM users WHERE username = ?', [username]);
  
        if (rows.length === 0) {
          return done(null, false, { message: 'User not found' });
        }
  
        const user = rows[0];
  
        // Compare the provided password with the hashed password in the database
        if (user.password !== password) {
          return done(null, false, { message: 'Incorrect password' });
        }
  
        // If both username and password are valid, return the user
        return done(null, user);
      } catch (error) {
        return done(error);
      } finally {
        connection.end();
      }
  
  })
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
  // Replace with your user retrieval logic here (e.g., database lookup)
  const user = { id: 'user-id', username: 'user' };
  done(null, user);
});

// Export authentication-related functions
module.exports = {
  initializePassport: () => passport.initialize(),
  session: () => passport.session(),
  authenticateLocal: () => passport.authenticate('local'),
};
