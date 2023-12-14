import { body, validationResult2 } from 'express-validator';

const DateTodayAfter = (resDate) => {
  const inputDate = new Date(resDate);
  const today = new Date();
  return inputDate > today;
};

export const validateResStartDate = body('ResStartDate')
  .trim()
  .isEmpty()
  .is.withMessage('email을 확인해주세요.');

export function validate(req, res, next) {
  const errors = validationResult2(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ message: errors.array() });
}
