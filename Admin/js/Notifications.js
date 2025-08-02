// admin.js - ระบบ Admin สำหรับส่งการแจ้งเตือน

let selectedType = '';

const typeNames = {
    'news': 'ข่าวสาร',
    'event': 'กิจกรรม',
    'announcement': 'ประกาศ',
    'promotion': 'โปรโมชั่น',
    'recruitment': 'รับสมัครงาน',
    'education': 'การศึกษา'
};

// จัดการการเลือกประเภท
document.querySelectorAll('.pr-type-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.pr-type-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        selectedType = this.dataset.type;
    });
});

// จัดการการส่งฟอร์ม
document.getElementById('adminForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!selectedType) {
        alert('กรุณาเลือกประเภทการแจ้งเตือน');
        return;
    }
    
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    
    // สร้างการแจ้งเตือนใหม่
    const notification = {
        id: Date.now(),
        type: selectedType,
        title: title,
        content: content,
        time: new Date().toISOString().replace('T', ' ').substring(0, 19),
        isRead: false,
        sentBy: 'admin',
        sentAt: new Date().toISOString()
    };
    
    // บันทึกลง localStorage
    saveNotification(notification);
    
    // แสดงการแจ้งเตือนที่ส่งแล้ว
    displaySentNotification(notification);
    
    // อัพเดทสถิติ
    updateStats();
    
    // รีเซ็ตฟอร์ม
    resetForm();
    
    alert('✅ ส่งการแจ้งเตือนเรียบร้อยแล้ว!');
});

// บันทึกการแจ้งเตือนลง localStorage
function saveNotification(notification) {
    let notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.unshift(notification); // เพิ่มที่ด้านบน
    
    // เก็บแค่ 50 รายการล่าสุด
    if (notifications.length > 50) {
        notifications = notifications.slice(0, 50);
    }
    
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    // ส่งสัญญาณให้ User รู้ว่ามีการแจ้งเตือนใหม่
    localStorage.setItem('newNotification', Date.now().toString());
}

// แสดงการแจ้งเตือนที่ส่งแล้ว
function displaySentNotification(notification) {
    const container = document.getElementById('sentNotifications');
    
    const notificationElement = document.createElement('div');
    notificationElement.className = 'notification-item';
    notificationElement.innerHTML = `
        <div class="notification-title">${notification.title}</div>
        <div style="font-size: 0.9em; color: #666; margin-top: 5px;">
            ${typeNames[notification.type]}
        </div>
        <div class="notification-time">
            เมื่อ ${formatTime(notification.sentAt)}
        </div>
    `;
    
    // ถ้าเป็นการแจ้งเตือนแรก แทนที่ข้อความ "ยังไม่มี"
    if (container.children.length === 1 && container.textContent.includes('ยังไม่มี')) {
        container.innerHTML = '';
    }
    
    container.insertBefore(notificationElement, container.firstChild);
    
    // เก็บแค่ 5 รายการล่าสุดในการแสดงผล
    while (container.children.length > 5) {
        container.removeChild(container.lastChild);
    }
}

// อัพเดทสถิติ
function updateStats() {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const today = new Date().toDateString();
    
    document.getElementById('totalSent').textContent = notifications.length;
    
    const todayNotifications = notifications.filter(n => 
        new Date(n.sentAt).toDateString() === today
    );
    document.getElementById('todaySent').textContent = todayNotifications.length;
}

// รีเซ็ตฟอร์ม
function resetForm() {
    document.getElementById('title').value = '';
    document.getElementById('content').value = '';
    document.querySelectorAll('.pr-type-btn').forEach(btn => btn.classList.remove('active'));
    selectedType = '';
}

// จัดรูปแบบเวลา
function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('th-TH', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// โหลดการแจ้งเตือนที่ส่งแล้วเมื่อเริ่มต้น
function loadSentNotifications() {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const recentNotifications = notifications.slice(0, 5); // แสดง 5 รายการล่าสุด
    
    if (recentNotifications.length > 0) {
        document.getElementById('sentNotifications').innerHTML = '';
        recentNotifications.forEach(notification => {
            displaySentNotification(notification);
        });
    }
    
    updateStats();
}

// เริ่มต้นระบบ
document.addEventListener('DOMContentLoaded', function() {
    loadSentNotifications();
});

// sidePanel
function openNav() {
  document.getElementById("mySidepanel").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidepanel").style.width = "0";
}