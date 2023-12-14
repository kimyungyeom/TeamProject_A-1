import { body, validationResult } from 'express-validator';

export const reservationValidation = [
  body('reserve_date').isDate().withMessage('올바른 날짜 형식이어야 합니다.'),
  body('cats').isInt().isLength({ max: 2 }).withMessage('최대 10마리 이하만 맡길 수 있습니다.'),
  body('res_comment').isString().withMessage('문자열이어야 합니다.'),
  body('visit_time')
    .matches(/^(0[9]|1\d|2[0-2]):[0-5]\d$/)
    .withMessage('09:00~22:00사이만 입력 가능합니다.'),
  body('pickup_time')
    .matches(/^(0[9]|1\d|2[0-2]):[0-5]\d$/)
    .withMessage('09:00~22:00사이만 입력 가능합니다.'),
];

export function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ message: errors.array() });
}
