import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import passport from 'passport';
import '../config/passport.js';

const router = express.Router();
// 회원가입 local
router.get('/signup', (req, res, next) => {
  res.render('signup.ejs', {
    errors: null,
  });
});

router.get('/login', (req, res, next) => {
  res.render('login.ejs');
});

export default router;
