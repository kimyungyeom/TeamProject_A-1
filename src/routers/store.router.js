import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { checkAuthenticated, checkStoreOwner } from '../middlewares/Authorizations.js';
const router = express.Router();

// 게시글 작성
router.post('/', checkAuthenticated, async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const { title, content, price, images, able_date, experience, state, city, address } = req.body;

    const newStore = await prisma.stores.create({
      data: {
        title,
        content,
        price: +price,
        able_date: { able_date },
        images: '하이',
        experience,
        state,
        city,
        address,
        user: {
          connect: {
            user_id: +user_id,
          },
        },
      },
    });

    return res.redirect(`../store/${newStore.store_id}`);
  } catch (err) {
    next(err);
  }
});

// 게시글 수정
router.put('/:store_id', checkStoreOwner, async (req, res, next) => {
  const { store_id } = req.params;
  const { title, content, price, images, able_date, experience, state, city, address } = req.body;

  try {
    await prisma.stores.update({
      where: {
        store_id: +store_id,
      },
      data: {
        title: title ? title : req.store.title,
        content: content ? content : req.store.content,
        price: +price ? price : req.store.price,
        images: images ? images : req.store.images,
        able_date: able_date ? able_date : req.store.able_date,
        experience: experience ? experience : req.store.experience,
        state: state ? state : req.store.state,
        city: city ? city : req.store.city,
        address: address ? address : req.store.address,
      },
    });
    return res.redirect(`/store/${store_id}`);
  } catch (err) {
    next(err);
  }
});

// 게시글 삭제
router.delete('/:store_id', checkStoreOwner, async (req, res, next) => {
  const { store_id } = req.params;

  try {
    // 예약이
    // const checkout = await prisma.reservations.findMany({
    //   where: {
    //     store_id: +store_id,
    //   },
    // });

    // if (checkout) {
    // }

    const deleteStore = await prisma.stores.delete({
      where: {
        store_id: +store_id,
      },
    });

    return res.json({ data: deleteStore });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

export default router;
