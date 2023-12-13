// import
import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import cookieSession from 'cookie-session';
import 'dotenv/config';
import ErrorHandlingMiddleware from './middlewares/error-handling.middleware.js';
import path from 'path';
import { fileURLToPath } from 'url';

import reservationRouter from './routers/reservation.router.js';
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
const currentModuleURL = import.meta.url;
const currentModulePath = fileURLToPath(currentModuleURL);
app.set('views', path.join(currentModulePath, '../views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
// 임시
app.use('/api', [reservationRouter]);
// router middleware
app.use('/api/auth/', AuthRouter);
app.use('/api/post', ReviewsRouter);
app.get('/', checkAuthenticate, (req, res) => {
  const user = req.user;
  console.log('USER', user);
  res.render('index.ejs', { user });
});
app.get('/login', (req, res) => {
  res.render('login.ejs');
});
app.get('/signup', (req, res) => {
  res.render('signup.ejs');
});

app.use(ErrorHandlingMiddleware);
// 서버 구동
app.listen(PORT, () => {
  console.log(PORT, '포트로 서버 구동');
});
