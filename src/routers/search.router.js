import express from 'express';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  const search = req.query.search ? req.query.search : null;
  console.log(search);
  if (!search) {
    const results = await prisma.stores.findMany({});
    return res.send(results);
  } else {
    const results = await prisma.stores.findMany({
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

      where: {
        title: { contains: search },
      },
    });
    console.log(results);
    return res.render('store.search.ejs', {
      results: results,
      user: req.user ? req.user : null,
    });
  }
});

export default router;
