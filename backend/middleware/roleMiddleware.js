// middleware/roleMiddleware.js

exports.hasRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      // This should not happen if isAuthenticated middleware runs first
      return res.status(403).json({ error: "Forbidden: User role not found." });
    }
    
    // Check if the user's role matches the required role
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ error: "Forbidden: Insufficient permissions." });
    }
    
    // If the role matches, proceed to the next middleware or route handler
    next();
  };
};