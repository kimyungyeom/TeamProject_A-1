import express from 'express';

// front
import AuthFrontRouter from '../routers.front/auth.router.js';
import ReserveListRouter from '../routers.front/reservation.list.router.js';
import StoreRouter from '../routers.front/store.router.js';
import ReserveRouter from '../routers.front/reservation.router.js';
import AdminRouter from '../routers.front/adm.router.js';
// back
import BackStoreRouter from './store.router.js';
import AuthRouter from './auth.router.js';

import SearchRouter from './search.router.js';
const mainRouter = express.Router();

mainRouter.use('/api/auth/', AuthRouter);
mainRouter.use('/api/store', BackStoreRouter);
mainRouter.use('/api/search', SearchRouter);

//front
mainRouter.use('/', AuthFrontRouter);
mainRouter.use('/reserve_list/', ReserveListRouter);
mainRouter.use('/store/', StoreRouter);
mainRouter.use('/reservation/', ReserveRouter);

mainRouter.use('/adm/', AdminRouter);

//back
// 로그인/회원가입
mainRouter.use('/api/auth/', AuthRouter);

export default mainRouter;
