import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { checkAdmin } from '../middlewares/Authorizations.js';
const router = express.Router();
// 전체 유저 조회
router.get('/users', checkAdmin, async (req, res, next) => {
  const users = await prisma.users.findMany({
    where: {
      user_level: 1,
    },
    include: {
      _count: {
        select: {
          reservation: true,
        },
      },
    },
  });
  res.render('adm/users.ejs', {
    users: users,
  });
});

// 유저상세조회
router.get('/users/:user_id', checkAdmin, async (req, res, next) => {
  const user = req.params.user_id;
  const selectUser = await prisma.users.findFirst({
    where: {
      user_id: +user,
    },
  });

  const recentReserve = await prisma.reservations.findMany({
    take: 3,
    orderBy: [
      {
        created_at: 'desc',
      },
    ],
    where: {
      user_id: +user,
    },
    include: {
      store: true,
      user: true,
    },
  });

  res.render('adm/detail.user.ejs', {
    user: selectUser,
    recent: recentReserve,
  });
});

// 전체 시터 조회
router.get('/sitters', checkAdmin, async (req, res, next) => {
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

  const counts = await prisma.reservations.groupBy({
    by: ['store_id'],
    _count: {
      reserve_id: true,
    },
    _sum: {
      total_price: true,
    },
  });
  console.log(counts);
  res.render('adm/sitters.ejs', {
    stores,
    counts,
  });
});

//  시터 상세 조회
router.get('/sitter/:store_id', async (req, res, next) => {
  const store_id = req.params.store_id;

  const store = await prisma.stores.findFirst({
    where: {
      store_id: +store_id,
    },
    include: {
      user: true,
    },
  });

  res.render('adm/detail.sitter.ejs', {
    store,
  });
});

//  예약 내역
router.get('/reservation', async (req, res, next) => {
  const reservations = await prisma.reservations.findMany({
    //포스트 작성자 기준 확인
    select: {
      reserve_id: true,
      user_id: true,
      store_id: true,
      reserve_date: true,
      cats: true,
      approved: true,
      res_comment: true,
      total_price: true,
      created_at: true,
      updated_at: true,
    },
    orderBy: { created_at: 'desc' },
  });
  res.render('adm/reservation.ejs', { reservations });
});

//  예약 상세 내역
router.get('/reservation/:reservation_id', async (req, res, next) => {
  const reservation_id = req.params.reservation_id;
  const reservation = await prisma.reservations.findFirst({
    where: {
      reserve_id: +reservation_id,
    },
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
  console.log(reservation);
  res.render('adm/modify.reservation.ejs', { reservation });
});

// 리뷰 내역
router.get('/reviews', async (req, res, next) => {
  const reviews = await prisma.reviews.findMany({});
  console.log(reviews);
});

export default router;
