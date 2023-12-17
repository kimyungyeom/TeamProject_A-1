import express from 'express';

const router = express.Router();

router.post('/reserve/:reserve_id', (req, res, next) => {
  console.log('!');
});

export default router;
