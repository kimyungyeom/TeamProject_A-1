import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { checkAuthenticate } from '../middlewares/auth.js';
import { reconstructFieldPath } from 'express-validator/src/field-selection.js';
import { checkExact } from 'express-validator';

const router = express.Router();

// 전체 게시글 조회
router.get('/post', async (req, res) => {
  const posts = await prisma.posts.findMany({
    select: {
      postId: true,
      userId: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  if (!posts) {
    return res.json({ message: 'error' });
  }
  return res.json({ data: posts });
});

// 게시글 상세조회
router.get('/post/:postId', async (req, res) => {
  const { postId } = req.params;

  const post = await prisma.posts.findFirst({
    where: {
      postId: +postId,
    },
  });
  return res.json({ data: post });
});

// 게시글 작성
router.post('/post', checkAuthenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { title, content, price, startDate, endDate, career, experience } = req.body;
    const startTime = new Date(`${startDate}T00:00:00.000Z`).toISOString();
    const endTime = new Date(`${endDate}T00:00:00.000Z`).toISOString();

    const newPost = await prisma.posts.create({
      data: {
        userId: userId,
        title,
        content,
        price: +price,
        startDate: startTime,
        endDate: endTime,
        career,
        experience,
      },
    });
    return res.json({ data: newPost });
  } catch (err) {
    next(err);
  }
});

// 게시글 수정
router.put('/post/:postId', checkAuthenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;
    const { title, content, price, startDate, endDate, career, experience } = req.body;
    const startTime = new Date(`${startDate}T00:00:00.000Z`).toISOString();
    const endTime = new Date(`${endDate}T00:00:00.000Z`).toISOString();

    const post = await prisma.posts.findFirst({
      where: {
        postId: +postId,
      },
    });
    if (!post) {
      return res.status(404).send({ message: 'error' });
    }
    if (userId !== post.userId) {
      return res.status(403).send({ message: 'error' });
    }

    const updatePost = await prisma.posts.update({
      where: {
        postId: +postId,
      },
      data: {
        title,
        content,
        price: +price,
        startDate: startTime,
        endDate: endTime,
        career,
        experience,
      },
    });
    return res.json({ data: updatePost });
  } catch (err) {
    next(err);
  }
});

// 게시글 삭제
router.delete('/post/:postId', checkAuthenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;

    const post = await prisma.posts.findFirst({
      where: {
        postId: +postId,
      },
    });
    if (!post) {
      return res.status(404).send({ message: 'error' });
    }
    if (userId !== post.userId) {
      return res.status(403).send({ message: 'error' });
    }

    const deletePost = await prisma.posts.delete({
      where: {
        postId: +postId,
      },
    });
    return res.json({ data: deletePost });
  } catch (err) {
    next(err);
  }
});

export default router;
