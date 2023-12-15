import express from 'express';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router();
// 전체 유저 조회
router.get('/users', async (req, res, next) => {
  const users = await prisma.users.findMany({
    where: {
      user_level: 1,
    },
  });
  //console.log(users);
  res.render('adm/users.ejs', {
    users: users,
  });
  //res.send(users);
});

// 유저 수정
router.get('/users/:user_id', async (req, res, next) => {
  const user = req.params.user_id;
  console.log(user);
  const selectUser = await prisma.users.findFirst({
    where: {
      user_id: +user,
    },
  });

  res.render('adm/modify.user.ejs', {
    user: selectUser,
  });
});

// 전체 시터 조회
router.get('/petsitter', async (req, res, next) => {
  const stores = await prisma.stores.findMany({
    include: {
      user: {
        select: {
          email: true,
          name: true,
          phone: true,
        },
      },
    },
  });
  console.log(stores);
  res.render('adm/petsitter.ejs', {
    stores,
  });
  // res.send(users);
});

//  예약 내역
router.get('/reservation', async (req, res, next) => {
  const reservations = await prisma.reservations.findMany({});
  console.log(reservations);
  res.render('adm/reservation.ejs', { reservations });
});

// 리뷰 내역
router.get('/reviews', async (req, res, next) => {
  const reviews = await prisma.reviews.findMany({});
  console.log(reviews);
});

export default router;
