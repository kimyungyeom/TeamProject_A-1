import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { checkAuthenticate } from '../middlewares/auth.js';

const router = express.Router();

// API 예약 생성
router.post('/:postId/reservation', checkAuthenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;
    const { ResStartDate, ResEndDate, cats, visitTime, pickupTime, totalPrice } = req.body;
    const reservation = await prisma.Reservations.create({
      data: {
        userId: +userId,
        postId: +postId,
        ResStartDate: new Date(`${ResStartDate}T00:00:00.000Z`),
        ResEndDate: new Date(`${ResEndDate}T00:00:00.000Z`),
        cats: +cats,
        visitTime,
        pickupTime,
        totalPrice: +totalPrice,
      },
    });
    return res.status(201).json({ data: reservation });
  } catch (err) {
    next(err);
  }
});
// API 예약 상세보기
router.get('/reservation/:reservationId', checkAuthenticate, async (req, res, next) => {
  try {
    const { reservationId } = req.params;
    const reservationInfo = await prisma.Reservations.findUnique({
      where: { reservationId: +reservationId },
      select: {
        reservationId: true,
        ResStartDate: true,
        ResEndDate: true,
        cats: true,
        visitTime: true,
        pickupTime: true,
        totalPrice: true,
      },
    });
    res.status(200).json({ data: reservationInfo });
  } catch (err) {
    next(err);
  }
});
// API 예약 수정-상세페이지에서
router.patch('/reservation/:reservationId', checkAuthenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;
    // reservation 작성자가 맞는지 확인 필요
    const { reservationId } = req.params;
    const { ResStartDate, ResEndDate, cats, visitTime, pickupTime, totalPrice } = req.body;
    const reservation = await prisma.Reservations.update({
      where: { reservationId: +reservationId },
      data: {
        ResStartDate: new Date(`${ResStartDate}T00:00:00.000Z`),
        ResEndDate: new Date(`${ResEndDate}T00:00:00.000Z`),
        cats: +cats,
        visitTime,
        pickupTime,
        totalPrice: +totalPrice,
      },
    });
    return res.status(201).json({ data: reservation });
  } catch (err) {
    next(err);
  }
});
// API 예약 취소
router.delete('/reservation/:reservationId', checkAuthenticate, async (req, res, next) => {
  try {
    const { reservationId } = req.params;
    // 예약 작성자 확인 필요
    const reservationCanc = await prisma.Reservations.delete({
      where: { reservationId: +reservationId },
    });
    res.status(200).json({ data: reservationCanc });
  } catch (err) {
    next(err);
  }
});
// API 포스트별(유저) 예약 조회
router.get('/user/reservation', checkAuthenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const userLevel = req.user.userLevel;
    // userLevel에서 시터/예약자 확인
    const reservations = await prisma.Reservations.findMany({
      where: { userId: +userId },
      select: {
        reservationId: true,
        postId: true,
        ResStartDate: true,
        ResEndDate: true,
      },
    });
    res.status(200).json({ data: reservations });
  } catch (err) {
    next(err);
  }
});

export default router;
