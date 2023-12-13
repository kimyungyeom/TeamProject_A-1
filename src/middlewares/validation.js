import { body, validationResult } from 'express-validator';

export const validateEmail = body('email')
  .trim()
  .notEmpty()
  .isEmail()
  .withMessage('email을 확인해주세요.');

export const validatePassword = body('password')
  .trim()
  .notEmpty()
  .isLength({ min: 6 })
  .withMessage('password를 확인해주세요.');
export const validatePasswordCheck = body('passwordCheck')
  .trim()
  .notEmpty()
  .isLength({ min: 6 })
  .withMessage('passwordConfirm를 확인해주세요.');
export const validatePhone = body('phone')
  .notEmpty()
  .isMobilePhone()
  .isLength({ min: 11 })
  .withMessage('phone을 확인해주세요.');

export const validateUsername = body('username')
  .notEmpty()
  .trim()
  .withMessage('이름이 비어있습니다.');

export function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ message: errors.array() });
}
