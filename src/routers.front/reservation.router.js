import express from 'express';
import { prisma } from '../utils/prisma/index.js';
//import { checkAuthenticate } from '../middlewares/auth.js';
const router = express.Router();

// API 유저 예약 상세보기
router.get('/:reserve_id', async (req, res, next) => {
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
    const dateRange = reservationInfo.reserve_date.split(' ~ ');

    return res.render('reservation.ejs', {
      reservationInfo,
      startDate: dateRange[0],
      endDate: dateRange[1],
    });
  } catch (err) {
    next(err);
  }
});

export default router;
