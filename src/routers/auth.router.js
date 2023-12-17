import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import passport from 'passport';
import '../config/passport.js';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  validate,
  validateEmail,
  validatePassword,
  validatePasswordCheck,
  validatePhone,
  validateUsername,
} from '../middlewares/validation.js';
const currentModulePath = fileURLToPath(import.meta.url);

import multer from 'multer';
// multer 세팅
const storageEngine = multer.diskStorage({
  destination: (req, file, callback) => {
    const uploadPath = path.join(currentModulePath, `../../public/images`);
    callback(null, uploadPath);
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});
const upload = multer({ storage: storageEngine }).single('profile');

const router = express.Router();
// 회원가입 local
router.post(
  '/signup',
  upload,
  [
    validateEmail,
    validatePassword,
    validatePasswordCheck,
    validatePhone,
    validateUsername,
    validate,
  ],

  async (req, res, next) => {
    console.log(req.body);
    const { email, password, passwordCheck, phone, name, profile } = req.body;

    const image = req.file ? req.file.filename : '';

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
      profile: image,
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
      if (err) {
        return next(err);
      }
      res.redirect('/store');
    });
  })(req, res, next);
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
    successReturnToOrRedirect: '/store',
    failureRedirect: '/login',
  }),
);

router.post('/logout', (req, res, next) => {
  console.log('!');
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }

    return res.redirect('back');
  });
});
export default router;
