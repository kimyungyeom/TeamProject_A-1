import 'dotenv/config';

export const checkAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.user_level !== 10) {
      throw new Error('NotPermission');
    }
    return next();
  } else {
    res.redirect('/login');
  }
};
