// import
import { body, validationResult } from 'express-validator';

// export
export const validateComment = body('comment')
  .trim()
  .notEmpty()
  .withMessage('리뷰칸이 비어있습니다. 확인해주세요.');

export const validateRating = body('rating')
  .trim()
  .notEmpty()
  .isInt({ min: 1, max: 5 })
  .withMessage('rating을 확인해주세요.');

export function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ message: errors.array() });
}
