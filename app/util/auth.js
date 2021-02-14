function isLoggedIn(req, res, next) {
    if (req.session.username) {
      next();
    } else {
      res.json({success:'false', message:"access denied"})
    }
  }

module.exports = {
    isLoggedIn,
}