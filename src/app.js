// import
import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import cookieSession from 'cookie-session';
import 'dotenv/config';
import ErrorHandlingMiddleware from './middlewares/error-handling.middleware.js';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';

import mainRouter from './routers/main.router.js';
// port
const PORT = process.env.SERVER_PORT;

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

app.use(methodOverride('_method'));
app.set('views', path.join(currentModulePath, '../views'));
app.set('view engine', 'ejs');
// http에서 patch 등 사용하기

app.use(express.static(path.join(currentModulePath, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// 임시
app.use('/', mainRouter);

app.use(ErrorHandlingMiddleware);
// 서버 구동
app.listen(PORT, () => {
  console.log(PORT, '포트로 서버 구동');
});
