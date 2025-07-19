// script.js

// ฟังก์ชันสำหรับแสดงข้อความแจ้งเตือน (สามารถนำไปใช้กับปุ่ม "รายงาน" หรืออื่นๆ ได้)
function showUnderDevelopmentAlert() {
    alert('ฟังก์ชันนี้อยู่ระหว่างการพัฒนา โปรดกลับมาตรวจสอบภายหลังนะคะ!');
}

// ตัวอย่างการเพิ่ม event listener ให้กับปุ่ม (ถ้ามีหลายปุ่มที่ต้องการฟังก์ชันเดียวกัน)
// หากต้องการเพิ่ม Event Listener ให้กับปุ่ม "รายงาน" โดยใช้ JavaScript แทน onclick ใน HTML
// คุณสามารถเพิ่มโค้ดนี้ได้ แต่ต้องมั่นใจว่าองค์ประกอบนั้นมี ID หรือ Class ที่สามารถเลือกได้
// เช่น:
/*
document.addEventListener('DOMContentLoaded', function() {
    const reportButton = document.getElementById('reportBtn'); // สมมติว่ามี id="reportBtn" ในปุ่มรายงาน
    if (reportButton) {
        reportButton.addEventListener('click', showUnderDevelopmentAlert);
    }
});
*/