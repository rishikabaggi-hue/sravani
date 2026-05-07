export const checkRole = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const hasRole = requiredRoles.some((role) => req.user.roles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

export const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.roles.includes('admin')) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

export const isModerator = (req, res, next) => {
  if (!req.user || (!req.user.roles.includes('admin') && !req.user.roles.includes('moderator'))) {
    return res.status(403).json({ error: 'Moderator access required' });
  }
  next();
};
