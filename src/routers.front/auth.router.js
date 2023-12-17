import express from 'express';
import { checkNotAuthenticated } from '../middlewares/Authorizations.js';
const router = express.Router();

router.get('/', (req, res, next) => {
  res.redirect('/store');
});
// 회원가입 local
router.get('/signup', checkNotAuthenticated, (req, res, next) => {
  res.render('signup.ejs');
});

router.get('/login', checkNotAuthenticated, (req, res, next) => {
  res.render('login.ejs');
});

export default router;
