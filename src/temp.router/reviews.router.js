// import
import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { checkAuthenticate } from '../middlewares/auth.js';
import { validate, validateComment, validateRating } from '../middlewares/validation.review.js';

// reviews.js - global variables
const router = express.Router();

// 리뷰 생성 router
router.post(
  '/:store_id/reservation/:reserve_id/review',
  [validate, validateComment, validateRating],
  checkAuthenticate,
  async (req, res, next) => {
    try {
      const user_id = req.user.user_id;
      const { store_id, reserve_id } = req.params;
      const { comment, rating } = req.body;

      const store = await prisma.stores.findFirst({
        where: { store_id: +store_id },
      });

      // 게시글이 존재하지 않을 때 예외처리
      if (!store) {
        throw new Error('NotFoundStore');
      }

      // 해당 유저의 예약 정보 확인
      const reservation = await prisma.reservations.findUnique({
        where: { reserve_id: +reserve_id, user_id },
      });

      // 예약 정보가 없는 경우
      if (!reservation) {
        throw new Error('NotPermission');
      }

      // 예약한 userId와 로그인한 userId가 다를 경우
      if (reservation.user_id !== user_id) {
        throw new Error('NotPermission');
      }

      // 해당 유저가 해당 게시글에 리뷰를 작성했는지 확인
      const existReview = await prisma.reviews.findFirst({
        where: { store_id: +store_id, user_id },
      });

      // 이미 리뷰를 작성한 경우
      if (existReview) {
        throw new Error('ExistReview');
      }

      // 리뷰 생성
      const newReview = await prisma.reviews.create({
        data: {
          user_id: user_id,
          store_id: +store_id,
          reserve_id: +reserve_id,
          comment: comment,
          rating: +rating,
        },
      });

      // return res.redirect(`/store/${store_id}`);
      return res.status(201).json({ data: newReview });
    } catch (err) {
      next(err);
    }
  },
);

router.get('/reviews/:store_id', async (req, res, next) => {
  try {
    const { store_id } = req.params;
    const store = await prisma.stores.findFirst({
      where: { store_id: +store_id },
    });

    if (!store) {
      throw new Error('NotFoundStore');
    }

    const reviews = await prisma.reviews.findMany({
      where: { store_id: +store_id },
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return res.status(200).json({ reviews });
  } catch (err) {
    next(err);
  }
});

// 리뷰 수정 router
router.put(
  '/:store_id/reservation/:reserve_id/review/:review_id',
  [validate, validateComment, validateRating],
  checkAuthenticate,
  async (req, res, next) => {
    try {
      const user_id = req.user.user_id;
      const { store_id, reserve_id, review_id } = req.params;
      const { comment, rating } = req.body;

      const store = await prisma.stores.findFirst({
        where: { store_id: +store_id },
      });
      // 게시글이 존재하지 않을 때 예외처리
      if (!store) {
        throw new Error('NotFoundStore');
      }

      // 해당 유저의 예약 정보 확인
      const reservation = await prisma.reservations.findUnique({
        where: { reserve_id: +reserve_id, user_id },
      });

      // 예약 정보가 없는 경우
      if (!reservation) {
        throw new Error('NotPermission');
      }

      // 예약한 userId와 로그인한 userId가 다를 경우
      if (reservation.user_id !== user_id) {
        throw new Error('NotPermission');
      }

      // 리뷰 수정
      const updatedReview = await prisma.reviews.update({
        where: { review_id: +review_id },
        data: { comment, rating: +rating },
      });

      return res.status(200).json({ data: updatedReview });
    } catch (err) {
      next(err);
    }
  },
);

// 리뷰 삭제 router
router.delete(
  '/:store_id/reservation/:reserve_id/review/:review_id',
  checkAuthenticate,
  async (req, res, next) => {
    try {
      const user_id = req.user.user_id;
      const { store_id, reserve_id, review_id } = req.params;

      const store = await prisma.stores.findFirst({
        where: { store_id: +store_id },
      });
      // 게시글이 존재하지 않을 때 예외처리
      if (!store) {
        throw new Error('NotFoundStore');
      }

      // 해당 유저의 예약 정보 확인
      const reservation = await prisma.reservations.findUnique({
        where: { reserve_id: +reserve_id, user_id },
      });

      // 예약 정보가 없는 경우
      if (!reservation) {
        throw new Error('NotPermission');
      }

      // 예약한 userId와 로그인한 userId가 다를 경우
      if (reservation.user_id !== user_id) {
        throw new Error('NotPermission');
      }

      // 리뷰 삭제
      const deletedReview = await prisma.reviews.delete({
        where: { store_id: +store_id, review_id: +review_id },
      });

      return res.status(200).json({ data: deletedReview });
    } catch (err) {
      next(err);
    }
  },
);

// export
export default router;
