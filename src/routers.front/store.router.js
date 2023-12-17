import express from 'express';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  console.log(req.user);
  const stores = await prisma.stores.findMany({
    select: {
      store_id: true,
      user_id: true,
      title: true,
      content: true,
      created_at: true,
      updated_at: true,
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });
  if (!stores) {
    return res.json({ message: 'error' });
  }
  return res.render('mainstore.ejs', { stores, user: req.user });
});

// 게시글 작성
router.get('/post', async (req, res, next) => {
  try {
    return res.render('poststore.ejs', { user: req.user ? req.user : null });
  } catch (err) {
    next(err);
  }
});

//  스토어 상세 페이지
router.get('/:store_id', async (req, res, next) => {
  try {
    const { store_id } = req.params;
    const store = await prisma.stores.findUnique({
      where: {
        store_id: Number(store_id),
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    const reviews = await prisma.reviews.findMany({
      where: { store_id: +store_id },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return res.render('storereservation.ejs', { store, reviews, user: req.user ? req.user : null });
  } catch (err) {
    next(err);
  }
});

export default router;
