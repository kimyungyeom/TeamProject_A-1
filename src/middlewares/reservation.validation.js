import { body, validationResult2 } from 'express-validator';

export const validateReserveDate = body('reserve_date')
  .trim()
  .isEmpty()
  .is.withMessage('예약 일정을 확인해주세요.');

export const validateCats = body('cats')
  .trim()
  .isEmpty()
  .isNumeric()
  .is.withMessage('맡기시려는 반려묘 마릿수를 입력해주세요.');

export function validate(req, res, next) {
  const errors = validationResult2(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ message: errors.array() });
}
