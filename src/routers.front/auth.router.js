import express from 'express';

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log('!');
  res.redirect('/store');
});
// 회원가입 local
router.get('/signup', (req, res, next) => {
  res.render('signup.ejs');
});

router.get('/login', (req, res, next) => {
  res.render('login.ejs');
});

export default router;
