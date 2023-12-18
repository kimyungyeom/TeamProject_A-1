document.addEventListener('DOMContentLoaded', () => {
  const signInForm = document.getElementById('signInForm');
  const signInBtn = document.getElementById('signInBtn');
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');

  signInBtn.addEventListener('click', async () => {
    try {
      // Axios를 사용하여 POST 요청 보내기
      const response = await axios.post('/api/signin', {
        email: emailInput.value,
        password: passwordInput.value,
        rememberMe: document.getElementById('rememberMe').checked,
      });

      console.log('Server response:', response.data);
    } catch (error) {
      console.error('Error sending POST request:', error.message);
    }
  });
});
