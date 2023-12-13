import 'dotenv/config';

export const checkAuthenticate = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
};
