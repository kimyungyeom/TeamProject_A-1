// import
import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import cookieSession from 'cookie-session';
import 'dotenv/config';
import ErrorHandlingMiddleware from './middlewares/error-handling.middleware.js';

import { checkAuthenticate } from './middlewares/auth.js';

// port
const PORT = process.env.SERVER_PORT;

// import router
import AuthRouter from './routers/auth.router.js';
import ReviewsRouter from './routers/reviews.router.js';

// app.js - global variables
const app = express();

// global variables
app.use(
  cookieSession({
    name: 'cookie-session-name',
    keys: [process.env.COOKIESESSIONKEY],
  }),
);
app.use(function (request, response, next) {
  if (request.session && !request.session.regenerate) {
    request.session.regenerate = (cb) => {
      cb();
    };
  }
  if (request.session && !request.session.save) {
    request.session.save = (cb) => {
      cb();
    };
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// router middleware
app.use('/api/auth/', AuthRouter);
app.use('/api/post', ReviewsRouter);
app.get('/', checkAuthenticate, (req, res) => {
  const user = req.user;
  res.send(user);
});

app.use(ErrorHandlingMiddleware);
// 서버 구동
app.listen(PORT, () => {
  console.log(PORT, '포트로 서버 구동');
});
