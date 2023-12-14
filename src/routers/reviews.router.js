// import
import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { checkAuthenticate } from '../middlewares/auth.js';
import { validate, validateComment, validateRating } from '../middlewares/validation.review.js';

// reviews.js - global variables
const router = express.Router();

// 리뷰 생성 router
router.post(
  '/:postId/reservation/:reservationId/review',
  [validate, validateComment, validateRating],
  checkAuthenticate,
  async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { postId, reservationId } = req.params;
      const { comment, rating } = req.body;

      const post = await prisma.posts.findFirst({
        where: { postId: +postId },
      });

      // 게시글이 존재하지 않을 때 예외처리
      if (!post) {
        throw new Error('NotFoundPost');
      }

      // 해당 유저의 예약 정보 확인
      const reservation = await prisma.reservations.findUnique({
        where: { reservationId: +reservationId, userId },
      });

      // 예약 정보가 없는 경우
      if (!reservation) {
        throw new Error('NotPermission');
      }

      // 예약한 userId와 로그인한 userId가 다를 경우
      if (reservation.userId !== userId) {
        throw new Error('NotPermission');
      }

      // 해당 유저가 해당 게시글에 리뷰를 작성했는지 확인
      const existReview = await prisma.reviews.findFirst({
        where: { postId: +postId, userId },
      });

      // 이미 리뷰를 작성한 경우
      if (existReview) {
        throw new Error('ExistReview');
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
  },
);

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
  '/:postId/reservation/:reservationId/review/:reviewId',
  [validate, validateComment, validateRating],
  checkAuthenticate,
  async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { postId, reservationId, reviewId } = req.params;
      const { comment, rating } = req.body;

      const post = await prisma.posts.findFirst({
        where: { postId: +postId },
      });
      // 게시글이 존재하지 않을 때 예외처리
      if (!post) {
        throw new Error('NotFoundPost');
      }

      // 해당 유저의 예약 정보 확인
      const reservation = await prisma.reservations.findUnique({
        where: { reservationId: +reservationId, userId },
      });

      // 예약 정보가 없는 경우
      if (!reservation) {
        throw new Error('NotPermission');
      }

      // 예약한 userId와 로그인한 userId가 다를 경우
      if (reservation.userId !== userId) {
        throw new Error('NotPermission');
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
  '/:postId/reservation/:reservationId/review/:reviewId',
  checkAuthenticate,
  async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { postId, reservationId, reviewId } = req.params;

      const post = await prisma.posts.findFirst({
        where: { postId: +postId },
      });
      // 게시글이 존재하지 않을 때 예외처리
      if (!post) {
        throw new Error('NotFoundPost');
      }

      // 해당 유저의 예약 정보 확인
      const reservation = await prisma.reservations.findUnique({
        where: { reservationId: +reservationId, userId },
      });

      // 예약 정보가 없는 경우
      if (!reservation) {
        throw new Error('NotPermission');
      }

      // 예약한 userId와 로그인한 userId가 다를 경우
      if (reservation.userId !== userId) {
        throw new Error('NotPermission');
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
