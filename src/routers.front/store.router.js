import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { checkAuthenticated, checkStoreOwner } from '../middlewares/Authorizations.js';
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
router.get('/post', checkAuthenticated, async (req, res, next) => {
  try {
<<<<<<< HEAD
    return res.render('poststore.ejs', {
      user: req.user,
    });
=======
    return res.render('poststore.ejs', { user: req.user });
>>>>>>> 5e4337bc288890698e5aab3064e7af2e9c87e7b9
  } catch (err) {
    next(err);
  }
});

//  스토어 상세 페이지
router.get('/:store_id', async (req, res, next) => {
  const store_id = req.params.store_id;
  console.log(+store_id);
  try {
    const store = await prisma.stores.findFirst({
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
        // reservation: true,
      },
    });

<<<<<<< HEAD
    // const reviews = await prisma.reviews.findMany({
    //   where: { store_id: +store_id },
    //   include: {
    //     user: {
    //       select: {
    //         name: true,
    //       },
    //     },
    //   },
    // });
=======
    const reviews = await prisma.reviews.findMany({
      where: { store_id: +store_id },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        reservation: true,
      },
    });
<<<<<<< HEAD
>>>>>>> 4df9b7ecf7bf5f47ad8d027599c559278afef495

    return res.render('storereservation.ejs', {
      store,
      /* reviews,*/
      user: req.user ? req.user : null,
    });
=======
    return res.render('storereservation.ejs', { store, reviews, user: req.user });
>>>>>>> 5e4337bc288890698e5aab3064e7af2e9c87e7b9
  } catch (err) {
    next(err);
  }
});

// 게시글 수정
router.get('/edit/:store_id', checkAuthenticated, checkStoreOwner, async (req, res, next) => {
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

    return res.render('putstore.ejs', { store, store_id, user: req.user });
  } catch (err) {
    next(err);
  }
});

export default router;
