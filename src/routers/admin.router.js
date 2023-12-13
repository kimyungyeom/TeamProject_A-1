import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { type } from 'os';

const router = express.Router();
// 전체 유저 조회
router.get('/userlist', async (req, res, next) => {
  const users = await prisma.users.findMany({
    where: {
      userLevel: 1,
    },
  });

  res.send(users);
});

// 전체 시터 조회
router.get('/usersitter', async (req, res, next) => {
  const users = await prisma.users.findMany({
    where: {
      userLevel: 2,
    },
  });

  res.send(users);
});

//  예약 내역
router.get('/reservationlist', async (req, res, next) => {
  const reservation = await prisma.reservations.findMany({});
  console.log(reservation);
});

// 리뷰 내역
router.get('/reviews', async (req, res, next) => {
  const reviews = await prisma.reviews.findMany({});
  console.log(reviews);
});
export default router;
