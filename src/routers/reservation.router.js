import express from 'express';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router();
//메인 페이지에서 예약 가능한 포스팅을 확인한다
//포스트에서 예약을 한다 (예약 정보를 받는다)
//예약 정보를 바탕으로 데이터베이스에 등록된다.
//예약 정보를

// API 예약 생성
router.post('/reservation', async (req, res, next) => {
  try {
    //임시 userId, postId 가져오는 곳 바꾸어야 함
    const { userId, postId, startDate, endTime, cats, visitTime, pickupTime, totalPrice } =
      req.body;
    const reservation = await prisma.Reservations.create({
      data: {
        userId: +userId,
        postId: +postId,
        startDate,
        endTime,
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
router.get('/reservation/:reservationId', async (req, res, next) => {
  try {
    const { reservationId } = req.params;
    const reservationInfo = await prisma.Reservations.findUnique({
      where: { reservationId: +reservationId },
      select: {
        reservationId: true,
        startDate: true,
        endTime: true,
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
router.patch('/reservation/:reservationId', async (req, res, next) => {
  try {
    //임시 userId, postId 가져오는 곳 바꾸어야 함
    const { reservationId } = req.params;
    const { userId, postId, startDate, endTime, cats, visitTime, pickupTime, totalPrice } =
      req.body;
    const reservation = await prisma.Reservations.update({
      where: { reservationId: +reservationId },
      data: {
        startDate,
        endTime,
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
router.delete('/reservation/:reservationId', async (req, res, next) => {
  try {
    const reservationId = await prisma.Reservations.delete({
      where: { reservationId: +reservationId },
    });
    res.status(200).json({ data: reservationId });
  } catch (err) {
    next(err);
  }
});
// API 포스트별(시터/유저) 예약 조회
router.get('/user/reservation', async (req, res, next) => {
  try {
    // const userId = req.user.userId;
    // const userLevel = req.user.userLevel;
    // 임시
    const userId = 1;
    const userLevel = 1;

    const reservations = await prisma.Reservations.findMany({
      where: { userId: +userId },
      select: {
        reservationId: true,
        startDate: true,
        startDate: true,
      },
    });
    res.status(200).json({ data: reservations });
  } catch (err) {
    next(err);
  }
});

export default router;
