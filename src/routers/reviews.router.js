// import
import express from 'express';
import { prisma } from '../utils/prisma/index.js';
// import { checkAuthenticate } from '../middlewares/auth.js';

// reviews.js - global variables
const router = express.Router();

// 리뷰 생성 router
router.post('/:postId/reviews', async (req, res, next) => {
  try {
    const userId = '1'; // 유저 id 임시값
    const reservationId = '1'; // 예약 id 임시값
    const { postId } = req.params;
    const { comment, rating } = req.body;

    // 빈 입력값이 존재하는 경우
    if (!comment || !rating) {
      return res.status(400).send({ errorMessage: '!' });
    }

    const post = await prisma.posts.findFirst({
      where: { postId: +postId },
    });
    // 게시글이 존재하지 않을 때 예외처리
    // throw error로 보내기
    if (!post) {
      return res.status(404).send({ errorMessage: '!' });
    }
    // 예약Id와 유저Id가 다를 경우 예외처리
    // throw error로 보내기
    if (reservationId !== userId) {
      return res.status(403).send({ errorMessage: '!' });
    }

    // 리뷰 생성
    const reviews = await prisma.reviews.create({
      data: {
        userId: +userId,
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
    // throw error로 보내기
    if (!post) {
      return res.status(404).send({ errorMessage: '!' });
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
router.put('/:postId/reviews/:reviewId', async (req, res, next) => {
  try {
    const userId = '1'; // 유저 id 임시값
    const reservationId = '1'; // 예약 id 임시값
    const { postId, reviewId } = req.params;
    const { comment, rating } = req.body;

    const post = await prisma.posts.findFirst({
      where: { postId: +postId },
    });
    // 게시글이 존재하지 않을 때 예외처리
    if (!post) {
      return res.status(404).send({ errorMessage: '!' });
    }
    // 예약Id와 유저Id가 다를 경우 예외처리
    // throw error로 보내기
    if (reservationId !== userId) {
      return res.status(403).send({ errorMessage: '!' });
    }

    // 리뷰 수정
    const updatedReview = await prisma.reviews.update({
      where: { postId: +postId, reviewId: +reviewId },
      data: { comment, rating },
    });

    return res.status(200).json({ data: updatedReview });
  } catch (err) {
    next(err);
  }
});
// 리뷰 삭제 router
router.delete('/:postId/reviews/:reviewId', async (req, res, next) => {
  try {
    const userId = '1'; // 유저 id 임시값
    const reservationId = '1'; // 예약 id 임시값
    const { postId, reviewId } = req.params;

    const post = await prisma.posts.findFirst({
      where: { postId: +postId },
    });
    // 게시글이 존재하지 않을 때 예외처리
    if (!post) {
      return res.status(404).send({ errorMessage: '!' });
    }
    // 예약Id와 유저Id가 다를 경우 예외처리
    // throw error로 보내기
    if (reservationId !== userId) {
      return res.status(403).send({ errorMessage: '!' });
    }

    // 리뷰 삭제
    const deletedReview = await prisma.reviews.delete({
      where: { postId: +postId, reviewId: +reviewId },
    });

    return res.status(200).json({ data: deletedReview });
  } catch (err) {
    next(err);
  }
});

// export
export default router;
