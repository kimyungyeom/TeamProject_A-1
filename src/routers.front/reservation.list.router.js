import express from 'express';
import { prisma } from '../utils/prisma/index.js';
//import { checkAuthenticate } from '../middlewares/auth.js';

const router = express.Router();

// API 포스트별(시터) 예약목록 조회
router.get('/sitter', async (req, res, next) => {
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
    res.status(200).json({ data: AllReservations, user: req.user ? req.user : null });
  } catch (err) {
    next(err);
  }
});

//포스트별(유저) 예약목록 조회
router.get('/user', async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    // userLevel에서 시터/예약자 확인
    const AllReservations = await prisma.reservations.findMany({
      where: { user_id: +user_id },
      include: {
        store: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
    return res.render('user.reservations.ejs', {
      data: AllReservations,
      user_id,
      user: req.user ? req.user : null,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
