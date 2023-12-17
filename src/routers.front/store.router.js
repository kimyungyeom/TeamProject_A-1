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
  return res.render('mainstore.ejs', { stores });
});

//  스토어 상세 페이지
router.get('/:store_id', async (req, res) => {
  try {
    const { store_id } = req.params;
    const store = await prisma.stores.findUnique({
      where: {
        store_id: +store_id,
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
    return res.render('storereservation.ejs', { store });
  } catch (err) {
    next(err);
  }
});

export default router;
