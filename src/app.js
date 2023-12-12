// import
import express from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

// port
const PORT = process.env.SERVER_PORT;

// import router

// app.js - global variables
const app = express();

// global variables
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// router middleware

// 서버 구동
app.listen(PORT, () => {
  console.log(PORT, '포트로 서버 구동');
});
