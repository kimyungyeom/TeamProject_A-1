import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import 'dotenv/config';
import { prisma } from '../utils/prisma/index.js';

passport.serializeUser((user, done) => {
  done(null, user.userId);
});
// client => session => request
passport.deserializeUser((id, done) => {
  prisma.users.findUnique({ where: { userId: Number(id) } }).then((user) => {
    delete user.password;
    delete user.googleId;
    delete user.kakaoId;
    done(null, user);
  });
});
const LocalStrategyConfig = new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  async (email, password, done) => {
    const user = await prisma.users.findUnique({
      where: { email: email },
    });
    if (!user) {
      return done(null, false, { msg: `Email ${email} not found` });
    }
    const comparePW = user.password === password;
    if (!comparePW) {
      return done(null, false, { msg: `password not correct` });
    }
    done(null, user);
  },
);

passport.use('local', LocalStrategyConfig);

const googleClientID = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleStrategyConfig = new GoogleStrategy(
  {
    clientID: googleClientID,
    clientSecret: googleClientSecret,
    callbackURL: '/api/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    const user = await prisma.users.findUnique({
      where: { email: profile.emails[0].value },
    });

    if (user) {
      done(null, user); // 로그인 인증 완료
    } else {
      const newUser = {
        email: profile.emails[0].value,
        password: 'GoogleLogin',
        username: profile.displayName,
        googleId: profile.id,
        profile: profile.photos[0].value,
        phone: 'null',
      };
      const createUser = await prisma.users.create({
        data: newUser,
      });
      if (!createUser) {
        return done(new Error());
      }
      done(null, createUser);
    }
  },
);
passport.use('google', googleStrategyConfig);
