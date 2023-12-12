import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { body } from 'express-validator';
const router = express.Router();

router.post('/signup', async (req, res, next) => {});

export default router;
