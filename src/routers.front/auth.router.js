import express from 'express';

const router = express.Router();
// 회원가입 local
router.get('/signup', (req, res, next) => {
  res.render('signup.ejs');
});

router.get('/login', (req, res, next) => {
  res.render('login.ejs');
});

export default router;
