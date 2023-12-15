import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { checkAuthenticate } from '../middlewares/auth.js';

const router = express.Router();

// 전체 게시글 조회
router.get('/store', async (req, res) => {
  const stores = await prisma.stores.findMany({
    select: {
      store_id: true,
      user_id: true,
      title: true,
      content: true,
      created_at: true,
      updated_at: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });
  if (!stores) {
    return res.json({ message: 'error' });
  }
  return res.json({ data: stores });
});

// 게시글 상세조회
router.get('/store/:store_id', async (req, res) => {
  const { store_id } = req.params;

  const store = await prisma.stores.findFirst({
    where: {
      store_id: +store_id,
    },
  });
  return res.json({ data: store });
  // res.render('store.ejs', { data: store });
});

// 게시글 작성
router.post('/store', checkAuthenticate, async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const { title, content, price, images, able_date, experience, state, city, address } = req.body;

    const newStore = await prisma.stores.create({
      data: {
        user_id: +user_id,
        title,
        content,
        price: +price,
        able_date,
        images,
        experience,
        state,
        city,
        address,
      },
    });
    return res.json({ data: newStore });
  } catch (err) {
    next(err);
  }
});

// 게시글 수정
router.put('/store/:store_id', checkAuthenticate, async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const { store_id } = req.params;
    const { title, content, price, images, able_date, experience, state, city, address } = req.body;

    const store = await prisma.stores.findUnique({
      where: {
        store_id: +store_id,
      },
    });

    if (!store) {
      return res.status(404).send({ message: 'error' });
    }
    if (user_id !== store.user_id) {
      return res.status(403).send({ message: 'error' });
    }

    const updateStore = await prisma.stores.update({
      where: {
        store_id: +store_id,
      },
      data: {
        title,
        content,
        price: +price,
        images,
        able_date,
        experience,
        state,
        city,
        address,
      },
    });
    return res.json({ data: updateStore });
  } catch (err) {
    next(err);
  }
});

// 게시글 삭제
router.delete('/store/:store_id', checkAuthenticate, async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const { store_id } = req.params;

    const store = await prisma.stores.findFirst({
      where: {
        store_id: +store_id,
      },
    });
    if (!store) {
      return res.status(404).send({ message: 'error' });
    }
    if (user_id !== store.user_id) {
      return res.status(403).send({ message: 'error' });
    }

    const deleteStore = await prisma.stores.delete({
      where: {
        store_id: +store_id,
      },
    });
    return res.json({ data: deleteStore });
  } catch (err) {
    next(err);
  }
});

export default router;
