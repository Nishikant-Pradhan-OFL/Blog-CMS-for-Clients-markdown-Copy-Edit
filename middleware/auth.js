function isAuthenticated(req, res, next) {
  if (req.session && req.session.user === process.env.ADMIN_USER) {
    return next();
  } else {
    res.redirect('/login');
  }
}

module.exports = isAuthenticated;