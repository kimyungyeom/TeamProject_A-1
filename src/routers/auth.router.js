import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import passport from 'passport';
import '../config/passport.js';

import {
  validate,
  validateEmail,
  validatePassword,
  validatePasswordCheck,
  validatePhone,
  validateUsername,
} from '../middlewares/validation.js';

const router = express.Router();
// 회원가입 local
router.post(
  '/signup',
  [
    validateEmail,
    validatePassword,
    validatePasswordCheck,
    validatePhone,
    validateUsername,
    validate,
  ],
  async (req, res, next) => {
    const { email, password, passwordCheck, phone, name } = req.body;
    if (password === passwordCheck) {
    }
    const existEmailCheck = await prisma.users.findFirst({
      where: {
        email: email,
      },
    });
    if (existEmailCheck) {
      return next(new Error('ExistEmail'));
    }
    const newUser = {
      email,
      password,
      phone,
      name,
    };

    const ExistUser = await prisma.users.create({
      data: newUser,
    });
    delete ExistUser.password;
    delete ExistUser.google_id;
    delete ExistUser.kakao_id;
    delete ExistUser.profile;
    return res.status(200).send(ExistUser);
    //res.redirect('/login');
  },
);

router.post('/login', [validateEmail, validatePassword, validate], (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      console.log('no user');
      return res.json({ msg: info });
    }

    req.logIn(user, function (err) {
      if (err) return next(err);
      console.log(req.session);
      res.redirect('/');
    });
  })(req, res, next);
});

//logout
router.post('/logout', (req, res, next) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    accessType: 'offline',
    prompt: 'consent',
  }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login',
  }),
);

router.get('passportlogin', (req, res, next) => {
  passport.authenticate('jwt', { session: false });
});

// front end
router.get('/users', (req, res) => {
  res.render('adm/users.ejs');
});

router.get('/petsitter', (req, res) => {
  res.render('adm/petsitter.ejs');
});
router.get('/reservation', (req, res) => {
  res.render('adm/reservation.ejs');
});
export default router;
