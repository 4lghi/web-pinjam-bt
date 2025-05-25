function isAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ status: "error", message: "Akses khusus admin" });
  }
}

function isUser(req, res, next) {
  if (req.user && req.user.role === "user") {
    next();
  } else {
    res.status(403).json({ status: "error", message: "Akses khusus user" });
  }
}

module.exports = { isAdmin, isUser };
// This middleware checks if the user has the role of admin or user