import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
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
