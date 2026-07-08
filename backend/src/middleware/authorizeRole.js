const ROLE_NAMES = {
  TEAM_MEMBER: 'team_member',
  MANAGER: 'manager'
};

export function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: insufficient role permissions' });
    }

    next();
  };
}

export { ROLE_NAMES };
