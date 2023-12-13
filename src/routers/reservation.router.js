import express from 'express';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router();

// API 유저의 예약 조회
router.get('/user/reservation', async (req, res, next) => {
  //임시
  const userId = 1;
  const reservations = await prisma.post.findMany({});
});
