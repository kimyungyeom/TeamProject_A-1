import { body, validationResult } from 'express-validator';

export const reservationValidation = [
  body('reserve_date').notEmpty().withMessage('일정이 비어있습니다.'),
  body('cats').isInt({ min: 1, max: 10 }).withMessage('최대 10마리 이하만 맡길 수 있습니다.'),
  body('res_comment').notEmpty().withMessage('주의사항이나 인사말을 남겨주세요!'),
  body('visit_time')
    .matches(/^(0[9]|1\d|2[0-2]):[0-5]\d$/)
    .withMessage('09:00~22:00사이만 입력 가능합니다.'),
  body('pickup_time')
    .matches(/^(0[9]|1\d|2[0-2]):[0-5]\d$/)
    .withMessage('09:00~22:00사이만 입력 가능합니다.'),
];

export function validate(req, res, next) {
  console.log('#');
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    console.log('$');
    return next();
  }
  console.log('^');
  return res.status(400).json({ message: errors.array() });
}
