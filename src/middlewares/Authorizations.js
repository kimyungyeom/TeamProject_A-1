/*

인가를 관리하는 미들웨어

*/

//  로그인 검증

import { prisma } from '../utils/prisma/index.js';

export const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log('login');
    return next();
  } else {
    res.redirect('/login');
  }
};
// 로그인 정보 없는 상태 확인
export const checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/store');
  }
  next();
};

// 로그인 유저가  ADMIN 인지 확인
export const checkAdmin = (req, res, next) => {
  if (Number(req.user.user_level) === 10) {
    next();
  }
  throw new Error('NotPermission');
};

// store Owner check
export const checkStoreOwner = async (req, res, next) => {
  const { store_id } = req.params;
  const user_id = req.user.user_id;

  const store = await prisma.stores.findUnique({
    where: {
      store_id: +store_id,
    },
  });
  if (user_id !== store.user_id) {
    next(new Error('NotPermission'));
  }
  req.store = store;
  next();
};

// 예약정보 유저가 요청시
export const checkReservationUser = async (req, res, next) => {
  const { reserve_id } = req.params;

  const { user_id } = req.user.user_id;

  const reservation = await prisma.reservations.findUnique({
    where: {
      reserve_id: +reserve_id,
    },
  });
  if (!reservation) {
    next(new Error('UserNotFound'));
  }
  if (reservation.user_id !== user_id) {
    next(new Error('NotPermission'));
  }
  req.reservation = reservation;
  next();
};

// 예약정보 시터가 요청시
export const checkReservationSitter = async (req, res, next) => {
  const { reserve_id } = req.params;
  const { user_id } = req.user.user_id;

  const reservation = await prisma.reservations.findUnique({
    where: {
      reserve_id: +reserve_id,
    },
    include: {
      store: true,
    },
  });
  if (!reservation) {
    next(new Error('NotFoundStore'));
  }
  if (reservation.store.user_id !== user_id) {
    next(new Error('NotPermission'));
  }

  req.reservation = reservation;
  next();
};
