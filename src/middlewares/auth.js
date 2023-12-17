import 'dotenv/config';

export const checkAuthenticate = (req, res, next) => {
  console.log('!');
  if (req.isAuthenticated()) {
    console.log('@');
    return next();
  } else {
    res.redirect('/login');
  }
};

export const checkReservationWriter = (req, res, next) => {
  const userId = req.user.userId;
  const reservationInfo = req.params;
  if (userId === reservationInfo.userId) {
    return next();
  } else {
    // 작성자가 아닌 경우 뒤로가기로 보내면서 프롬프트
    res.redirect('back');
    res.send(`
      <script>
        window.onbeforeunload = function() {
          return '작성자만 해당 작업을 수행할 수 있습니다. 변경 사항이 저장되지 않을 수 있습니다. 정말로 이 페이지를 떠나시겠습니까?';
        };
        window.location.href = document.referrer;
      </script>
    `);
  }
};
