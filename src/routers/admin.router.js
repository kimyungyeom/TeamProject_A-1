import express from 'express';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router();

router.get('/userlist', async (req, res, next) => {
  console.log('AdminRoute');
  const users = await prisma.users.findMany();
  res.send(users);
});
export default router;
