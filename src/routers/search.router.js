import express from 'express';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  const search = req.query.search ? req.query.search : null;
  if (!search) {
    const result = await prisma.stores.findMany({});
    res.send(result);
  } else {
    const result = await prisma.stores.findMany({
      where: {
        title: {
          contains: search,
        },
      },
    });
    console.log(result);
    res.send(result);
  }
});

export default router;
