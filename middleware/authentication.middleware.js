const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const SECRET_KEY = process.env.AUTH_SECRET_KEY;

  if (!SECRET_KEY) {
    throw new Error("Missing AUTH_SECRET_KEY");
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({
      status: false,
      message: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      status: false,
      message: "Invalid or expired token.",
    });
  }
}

module.exports = authenticateToken;