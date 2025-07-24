// Ultra Fast Translation - Dictionary Only
let isThai = true;
const btn = document.getElementById('translateBtn');
const els = ['.hero-text h1', '.subtitle', '.location-info p:nth-child(2)', '.location-info p:nth-child(3)', '.location-info p:nth-child(4)', '.footer p'];
let orig = {};

// Complete translation dictionary
const dict = {
  'หนึ่งคอนโดมิเนียม': 'The 1 Condo',
  'แจ้งวัฒนะ': 'Chaengwattana', 
  'อยู่ติดถนนใหญ่': 'Located on main road',
  'และ': 'and',
  'รถไฟฟ้าสายสีชมพู': 'Near The BTS Pink Line',
  '© 2025 The 1 Condo Management. All rights reserved.': '© 2025 The 1 Condo Management. All rights reserved.',
  // Reverse mapping
  'The 1 Condo': 'หนึ่งคอนโดมิเนียม',
  'Chaengwattana': 'แจ้งวัฒนะ',
  'Located on main road': 'อยู่ติดถนนใหญ่',
  'Near Purple Line BTS': 'รถไฟฟ้าสายสีม่วง'
};

function toggleLang() {
  btn.style.transform = 'scale(0.95)';
  
  if (isThai) {
    els.forEach(sel => {
      const el = document.querySelector(sel);
      if (el) el.textContent = dict[el.textContent.trim()] || el.textContent;
    });
    btn.textContent = 'EN';
    document.documentElement.lang = 'en';
  } else {
    els.forEach(sel => {
      const el = document.querySelector(sel);
      if (el && orig[sel]) el.textContent = orig[sel];
    });
    btn.textContent = 'TH';
    document.documentElement.lang = 'th';
  }
  
  isThai = !isThai;
  setTimeout(() => btn.style.transform = 'scale(1)', 100);
}

document.addEventListener('DOMContentLoaded', () => {
  els.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) orig[sel] = el.textContent.trim();
  });
  btn?.addEventListener('click', toggleLang);
});