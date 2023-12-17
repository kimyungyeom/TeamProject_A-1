import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { checkAuthenticated } from '../middlewares/Authorizations.js';

//import { checkAuthenticate } from '../middlewares/auth.js';
const router = express.Router();

// API 예약 상세보기
router.get('/:reserve_id', checkAuthenticated, async (req, res, next) => {
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
        store: true,
      },
    });

    return res.render('reservation.ejs', {
      reservationInfo,
      startDate: reservationInfo.store.able_date[0],
      endDate: reservationInfo.store.able_date[reservationInfo.store.able_date.length - 1],
      user: req.user ? req.user : null,
    });
  } catch (err) {
    next(err);
  }
});

// API 예약 상세보기 - 시터
router.get('/sitter/:reserve_id', checkAuthenticated, async (req, res, next) => {
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
        store: true,
      },
    });
    return res.render('sitter.reservationOne.ejs', {
      reservationInfo,
      user: req.user ? req.user : null,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
