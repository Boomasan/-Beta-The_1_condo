var texts = {
  th: {
    loginTitle: 'เข้าสู่ระบบ',
    username: 'ชื่อผู้ใช้',
    password: 'รหัสผ่าน',
    loginBtn: 'เข้าสู่ระบบ',
    registerBtn: 'สร้างบัญชีใหม่',
    success: 'เข้าสู่ระบบสำเร็จ! กำลังโหลด...',
    failed: 'เข้าสู่ระบบล้มเหลว',
    error: 'เกิดข้อผิดพลาด'
  },
  en: {
    loginTitle: 'Login',
    username: 'Username',
    password: 'Password',
    loginBtn: 'Login',
    registerBtn: 'Create Account',
    success: 'Login successful! Redirecting...',
    failed: 'Login failed',
    error: 'An error occurred'
  }
};

var currentLang = 'th';

var form = document.getElementById('loginForm');
var msg = document.getElementById('msg');
var registerBtn = document.getElementById('registerBtn');
var forgotpassBtn = document.getElementById('forgotpassBtn');
var langToggle = document.getElementById('langToggle');

function setLanguage(lang) {
  currentLang = lang;
  document.getElementById('loginTitle').textContent = texts[lang].loginTitle;
  document.querySelector('input[name=username]').placeholder = texts[lang].username;
  document.querySelector('input[name=password]').placeholder = texts[lang].password;
  document.getElementById('loginBtn').textContent = texts[lang].loginBtn;
  document.getElementById('registerBtn').textContent = texts[lang].registerBtn;
  langToggle.textContent = lang === 'th' ? 'EN' : 'TH';
}

langToggle.addEventListener('click', function () {
  setLanguage(currentLang === 'th' ? 'en' : 'th');
});

form.addEventListener('submit', function (e) {
  e.preventDefault();
  var formData = new FormData(form);
  var data = {
    username: formData.get('username'),
    password: formData.get('password')
  };

  fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(function (res) {
    return res.json().then(function (result) {
      if (res.ok) {
        msg.style.color = 'green';
        msg.textContent = texts[currentLang].success;
        setTimeout(function () {
          window.location.href = '/admin-payments.html';
        }, 1000);
      } else {
        msg.style.color = 'red';
        msg.textContent = result.message || texts[currentLang].failed;
      }
    });
  })
  .catch(function () {
    msg.textContent = texts[currentLang].error;
  });
});

registerBtn.addEventListener('click', function () {
  window.location.href = './register.html';
});
forgotpassBtn.addEventListener('click', function () {
  window.location.href = './forgotpass.html';
});

setLanguage(currentLang);
