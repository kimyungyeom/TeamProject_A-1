export default function (err, req, res, next) {
  console.error(err.message);
  switch (err.message) {
    case 'ExistEmail':
      return res.status(400).json({
        errorMessage: '이미 사용인 이메일 입니다.',
      });
    case 'password confirm not matched':
    case 'PasswordNotCorrect':
      return res.status(400).send({
        errorMessage: '패스워드가 일치하지 않습니다!',
      });
    case 'UserNotFound':
    case 'Need login':
    case 'accessTokenNotMatched':
      return res.status(401).send({
        errorMessage: '로그인을 해주세요!',
      });

    case 'Forbidden':
      return res.status(403).send({
        errorMessage: '권한이 없습니다.',
      });

    case 'EmailNotFound':
      return res.status(404).send({
        errorMessage: '이메일을 확인해주세요.',
      });

    case 'notFoundProduct':
      return res.status(404).send({
        errorMessage: '상품이 없습니다.',
      });

    case 'Product Create failed':
      return res.status(500).send({
        errorMessage: '등록에 실패하였습니다',
      });
    case 'Product Update failed':
      return res.status(500).send({
        errorMessage: '수정에 실패하였습니다',
      });
    case 'Product delete failed':
      return res.status(500).send({
        errorMessage: '삭제에 실패하였습니다',
      });
  }

  res.status(500).json({ errorMessage: '서버 내부 에러가 발생했습니다.' });
}
