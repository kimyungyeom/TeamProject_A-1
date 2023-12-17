import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { checkAuthenticate } from '../middlewares/auth.js';

import { reservationValidation, validate } from '../middlewares/reservation.validation.js';

const router = express.Router();

// API 예약 생성
router.post(
  '/store/:store_id',
  checkAuthenticate,
  reservationValidation,
  validate,
  async (req, res, next) => {
    try {
      console.log(req.body);
      const user_id = req.user.user_id;
      const { store_id } = req.params;
      const { reserve_date, cats, res_comment, visit_time, pickup_time, total_price } = req.body;
      const DateSpl = reserve_date;
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

      // 예약한 날짜 스토어의 비활성화 날짜로 만들기
      const dataRange = reserve_date.split(' ~ ');
      const fromDate = dataRange[0];
      const toDate = dataRange[1];

      const transData = {
        from: fromDate,
        to: toDate,
        reserve_id: +reservation.reserve_id,
      };
      // 스토어 찾기
      const store = await prisma.stores.findUnique({
        where: { store_id: +store_id },
        select: { able_date: true },
      });
      const oriAble_date = Array.isArray(store.able_date)
        ? store.able_date
        : String(store.able_date).split(', ');

      const updatedAble_date = [...oriAble_date, transData];

      const reserveDatePush = await prisma.stores.update({
        where: { store_id: +store_id },
        data: {
          able_date: updatedAble_date,
        },
      });

      return res.redirect(`../../../reservation/${reservation.reserve_id}`);
    } catch (err) {
      next(err);
    }
  },
);

// API 예약 수정-상세페이지에서
router.put('/:reserve_id', checkAuthenticate, async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const { reserve_id } = req.params;
    const { reserve_date, cats, res_comment, visit_time, pickup_time, total_price, approved } =
      req.body;
    const reservationInfo = await prisma.reservations.findUnique({
      where: { reserve_id: +reserve_id },
    });
    // 예약자 본인 확인
    // if (reservationInfo.user_id === user_id) {}
    const reservation = await prisma.reservations.update({
      where: { reserve_id: +reserve_id },
      data: {
        reserve_date: reserve_date,
        cats: +cats,
        res_comment,
        visit_time,
        pickup_time,
        approved: 'No',
        total_price: +total_price,
      },
    });
    return res.redirect(`../reservation/${reserve_id}`);
  } catch (err) {
    next(err);
  }
});

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
router.delete('/:reserve_id', checkAuthenticate, async (req, res, next) => {
  try {
    console.log('오셨어요?');
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
      return res.status(200).json({ data: reservationCanc });
    } else {
      throw new Error('Not a reserver');
    }
  } catch (err) {
    next(err);
  }
});

export default router;
