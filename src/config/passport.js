import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import 'dotenv/config';
import { prisma } from '../utils/prisma/index.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});
// client => session => request
passport.deserializeUser((id, done) => {
  prisma.users.findUnique({ where: { id: +id } }).then((user) => {
    done(null, user);
  });
});

const LocalStrategyConfig = new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  async (email, password, done) => {
    const user = await prisma.users
      .findUnique({
        where: { email: email },
      })
      .toJson();
    if (!user) {
      return done(null, false, { msg: `Email ${email} not found` });
    }
    const comparePW = user.password === password;
    if (!comparePW) {
      return done(null, false, { msg: `password not correct` });
    }

    return done(null, user);
  },
);

passport.use('local', LocalStrategyConfig);
