// import
import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { checkAuthenticate } from '../middlewares/auth.js';

// reviews.js - global variables
const router = express.Router();

// reservation check함수
const checkReservation = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const reservation = await prisma.reservations.findFirst({
      where: { userId },
    });
    // 해당 userId의 예약이 없는 경우
    if (!reservation) {
      throw new Error('NotPermission');
    }

    req.reservationId = reservation.reservationId;

    next();
  } catch (err) {
    next(err);
  }
};

// 리뷰 생성 router
router.post('/:postId/reviews', checkAuthenticate, checkReservation, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const reservationId = req.reservationId;
    const { postId } = req.params;
    const { comment, rating } = req.body;

    // 빈 입력값이 존재하는 경우
    if (!comment || !rating) {
      throw new Error('EmptyCreateValue');
    }

    // rating 범위를 벗어나는 경우
    if (rating < 1 || rating > 5) {
      throw new Error('InvalidValue');
    }

    const post = await prisma.posts.findFirst({
      where: { postId: +postId },
    });

    // 게시글이 존재하지 않을 때 예외처리
    if (!post) {
      throw new Error('NotFoundPost');
    }

    // 리뷰 생성
    const reviews = await prisma.reviews.create({
      data: {
        userId: userId,
        postId: +postId,
        reservationId: +reservationId,
        comment,
        rating,
      },
    });

    return res.status(201).json({ data: reviews });
  } catch (err) {
    next(err);
  }
});

// 리뷰 조회 router
router.get('/:postId/reviews', async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await prisma.posts.findFirst({
      where: { postId: +postId },
    });
    // 게시글이 존재하지 않을 때 예외처리
    if (!post) {
      throw new Error('NotFoundPost');
    }

    // 리뷰 조회
    const reviews = await prisma.reviews.findMany({
      where: { postId: +postId },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ data: reviews });
  } catch (err) {
    next(err);
  }
});

// 리뷰 수정 router
router.put(
  '/:postId/reviews/:reviewId',
  checkAuthenticate,
  checkReservation,
  async (req, res, next) => {
    try {
      const { postId, reviewId } = req.params;
      const { comment, rating } = req.body;

      // 빈 입력값이 존재하는 경우
      if (!comment || !rating) {
        throw new Error('EmptyEditValue');
      }
      // rating 범위를 벗어나는 경우
      if (rating < 1 || rating > 5) {
        throw new Error('InvalidValue');
      }

      const post = await prisma.posts.findFirst({
        where: { postId: +postId },
      });
      // 게시글이 존재하지 않을 때 예외처리
      if (!post) {
        throw new Error('NotFoundPost');
      }

      // 리뷰 수정
      const updatedReview = await prisma.reviews.update({
        where: { reviewId: +reviewId },
        data: { comment, rating },
      });

      return res.status(200).json({ data: updatedReview });
    } catch (err) {
      next(err);
    }
  },
);

// 리뷰 삭제 router
router.delete(
  '/:postId/reviews/:reviewId',
  checkAuthenticate,
  checkReservation,
  async (req, res, next) => {
    try {
      const { postId, reviewId } = req.params;

      const post = await prisma.posts.findFirst({
        where: { postId: +postId },
      });
      // 게시글이 존재하지 않을 때 예외처리
      if (!post) {
        throw new Error('NotFoundPost');
      }

      // 리뷰 삭제
      const deletedReview = await prisma.reviews.delete({
        where: { postId: +postId, reviewId: +reviewId },
      });

      return res.status(200).json({ data: deletedReview });
    } catch (err) {
      next(err);
    }
  },
);

// export
export default router;
