import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { checkAuthenticate } from '../middlewares/auth.js';
import { reservationValidation, validate } from '../middlewares/reservation.validation.js';

const router = express.Router();

router.get('');

// API 예약 랜더
router.get('/store/:store_id', async (req, res) => {
  try {
    const { store_id } = req.params;
    const store = await prisma.stores.findUnique({
      where: {
        store_id: +store_id,
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
    return res.render('storereservation.ejs', { store });
  } catch (err) {
    next(err);
  }
});

// API 예약 생성
//startDate, endDate//// json 형태로 받아서 사이 몇일인지 계산
router.post(
  '/store/:store_id',
  checkAuthenticate,
  reservationValidation,
  validate,
  async (req, res, next) => {
    try {
      const user_id = req.user.user_id;
      const { store_id } = req.params;
      const { reserve_date, cats, res_comment, visit_time, pickup_time, total_price } = req.body;
      const reservation = await prisma.reservations.create({
        data: {
          user: {
            connect: {
              user_id: +user_id,
            },
          },
          store: {
            connect: {
              store_id: +store_id,
            },
          },
          reserve_date,
          cats: +cats,
          res_comment,
          visit_time,
          pickup_time,
          total_price: +total_price,
          approved: 'No',
        },
      });
      return res.status(201).json('/reservation/:reserve_id', { data: reservation });
    } catch (err) {
      next(err);
    }
  },
);
// API 유저 예약 상세보기
router.get('/reservation/:reserve_id', checkAuthenticate, async (req, res, next) => {
  try {
    const { reserve_id } = req.params;
    const reservationInfo = await prisma.reservations.findUnique({
      where: {
        reserve_id: +reserve_id,
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

    return res.render('reservation.ejs', { reservationInfo });
  } catch (err) {
    next(err);
  }
});
// API 예약 수정-상세페이지에서
router.patch(
  '/reservation/:reserve_id',
  checkAuthenticate,
  reservationValidation,
  validate,
  async (req, res, next) => {
    try {
      const user_id = req.user.user_id;
      const { reserve_id } = req.params;
      const { reserve_date, cats, res_comment, visit_time, pickup_time, total_price } = req.body;
      const reservationInfo = await prisma.reservations.findUnique({
        where: { reserve_id: +reserve_id },
      });
      // 예약자 본인 확인
      if (reservationInfo.user_id === user_id) {
        const reservation = await prisma.reservations.update({
          where: { reserve_id: +reserve_id },
          data: {
            reserve_date: reserve_date,
            cats: +cats,
            res_comment,
            visit_time,
            pickup_time,
            total_price: +total_price,
          },
        });
        res.status(200).json({ data: reservation });
      } else {
        throw new Error('Not a reserver');
      }
    } catch (err) {
      next(err);
    }
  },
);

// API 예약 수정-상세페이지에서 - 시터가 승인여부 변경
router.patch('/sitter/:reserve_id', checkAuthenticate, async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const { reserve_id } = req.params;
    const { approved } = req.body;
    const reservationInfo = await prisma.reservations.findUnique({
      where: { reserve_id: +reserve_id },
      include: {
        store: {
          select: {
            user_id: true,
          },
        },
      },
    });
    const storeOwner = reservationInfo.store.user_id;
    // 스토어 주인 확인
    if (+storeOwner === +user_id) {
      const reservation = await prisma.reservations.update({
        where: { reserve_id: +reserve_id },
        data: {
          approved: { set: approved },
        },
      });
      return res.status(200).json({ data: reservation });
    } else {
      throw new Error('Not a reserver');
    }
  } catch (err) {
    next(err);
  }
});
// API 예약 취소
router.delete('/reservation/:reserve_id', checkAuthenticate, async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const { reserve_id } = req.params;
    const reservationInfo = await prisma.reservations.findUnique({
      where: { reserve_id: +reserve_id },
    });
    // 본인확인
    if (+reservationInfo.user_id === +user_id) {
      const reservationCanc = await prisma.reservations.delete({
        where: { reserve_id: +reserve_id },
      });
      res.status(200).json({ data: reservationCanc });
    } else {
      throw new Error('Not a reserver');
    }
  } catch (err) {
    next(err);
  }
});
// API 포스트별(유저) 예약목록 조회
router.get('/user/reservation', checkAuthenticate, async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    // userLevel에서 시터/예약자 확인
    const AllReservations = await prisma.reservations.findMany({
      where: { user_id: +user_id },
      select: {
        reserve_id: true,
        store_id: true,
        reserve_date: true,
        res_comment: true,
        cats: true,
        approved: true,
      },
      orderBy: { created_at: 'desc' },
    });
    res.status(200).json({ data: AllReservations });
  } catch (err) {
    next(err);
  }
});
// API 포스트별(시터) 예약목록 조회
router.get('/sitter/reservation', checkAuthenticate, async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    // userLevel에서 시터/예약자 확인
    const AllReservations = await prisma.reservations.findMany({
      where: { store: { user_id: +user_id } }, //포스트 작성자 기준 확인
      select: {
        reserve_id: true,
        user_id: true,
        store_id: true,
        reserve_date: true,
        res_comment: true,
        cats: true,
        approved: true,
      },
      orderBy: { created_at: 'desc' },
    });
    res.status(200).json({ data: AllReservations });
  } catch (err) {
    next(err);
  }
});

// API 어드민 예약목록 조회
router.get('/reservation/all', async (req, res, next) => {
  try {
    // const user_level = req.user.user_level;
    // userLevel에서 시터/예약자 확인
    const AllReservations = await prisma.reservations.findMany({
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
    res.render('전체 예약 조회', { data: AllReservations });
  } catch (err) {
    next(err);
  }
});

export default router;
