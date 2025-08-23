const isAdmin = (req, res, next) => {
  console.log('Session Data:', req.session); // Check session data
  console.log('User:', req.session.user); // Check user data in the session

  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  } else {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

module.exports = isAdmin;
