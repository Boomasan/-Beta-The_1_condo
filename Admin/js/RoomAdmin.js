// room.js - ระบบจัดการห้องพักให้เช่า
// API Base URL - แก้ไข URL นี้ให้ตรงกับ API server ของคุณ
const API_BASE_URL = 'http://localhost:3000/api/rooms';

// ข้อมูลตัวอย่าง 5 ห้อง (สำหรับทดสอบก่อนใช้ SQL)
let mockRooms = [
    {
        id: 1,
        room_name: "01/11",
        room_detail: "ห้องสตูดิโอขนาดกว้าง 25 ตร.ม. พร้อมเฟอร์นิเจอร์ครบ มีระเบียง วิวเมือง",
        room_image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
        price: 8500,
        available: true
    },
    {
        id: 2,
        room_name: "02/15",
        room_detail: "ห้อง 1 ห้องนอน ขนาด 35 ตร.ม. มีครัวแยก ห้องน้ำใน วิวสระว่ายน้ำ",
        room_image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
        price: 12000,
        available: true
    },
    {
        id: 3,
        room_name: "03/22",
        room_detail: "ห้องสตูดิโอหรู ขนาด 30 ตร.ม. ตกแต่งสวยงาม เฟอร์นิเจอร์ครบครัน",
        room_image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
        price: 9500,
        available: false
    },
    {
        id: 4,
        room_name: "04/08",
        room_detail: "ห้อง 1 ห้องนอน ขนาด 40 ตร.ม. มีห้องทำงาน ระเบียงใหญ่ วิวแม่น้ำ",
        room_image: "https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=400",
        price: 15000,
        available: true
    },
    {
        id: 5,
        room_name: "05/33",
        room_detail: "ห้องเพนท์เฮาส์ ขนาด 50 ตร.ม. 2 ห้องนอน ห้องรับแขก วิวพาโนรามา",
        room_image: "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=400",
        price: 18000,
        available: false
    }
];

// ตัวแปรสำหรับเก็บ ID ถัดไป
let nextId = 6;

// ฟังก์ชันสำหรับแสดงข้อความ
function showMessage(message, type = 'info') {
    const messageElement = document.getElementById('message');
    messageElement.innerHTML = `<div class="message ${type}">${message}</div>`;
    setTimeout(() => {
        messageElement.innerHTML = '';
    }, 3000);
}

// ฟังก์ชันสำหรับ format ราคา
function formatPrice(price) {
    return new Intl.NumberFormat('th-TH').format(price);
}

// ฟังก์ชันสำหรับสร้าง HTML แสดงห้อง
function createRoomHTML(room) {
    const statusClass = room.available ? 'available' : 'occupied';
    const statusText = room.available ? 'ห้องว่าง' : 'ห้องไม่ว่าง';

    return `
        <div class="room-card ${statusClass}">
            <img src="${room.room_image}" alt="${room.room_name}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
            <div class="room-info">
                <h4>ห้อง ${room.room_name}</h4>
                <p class="room-detail">${room.room_detail}</p>
                <p class="room-price">฿${formatPrice(room.price)}/เดือน</p>
                <p class="room-status ${statusClass}">${statusText}</p>
                <small>ID: ${room.id}</small>
            </div>
        </div>
    `;
}

// ===== GET Functions =====

// ฟังก์ชันดูข้อมูลห้องพัก
async function getRooms() {
    try {
        const roomId = document.getElementById('getRoomId').value;
        let rooms;

        if (roomId) {
            // ค้นหาห้องเฉพาะ ID
            const room = mockRooms.find(r => r.id == roomId);
            rooms = room ? [room] : [];
        } else {
            // แสดงทุกห้อง
            rooms = mockRooms;
        }

        // สำหรับใช้กับ API จริง (uncomment เมื่อพร้อม)
        /*
        const url = roomId ? `${API_BASE_URL}/${roomId}` : API_BASE_URL;
        const response = await axios.get(url);
        rooms = Array.isArray(response.data) ? response.data : [response.data];
        */

        const resultDiv = document.getElementById('getRooms');
        if (rooms.length === 0) {
            resultDiv.innerHTML = '<p class="no-data">ไม่พบข้อมูลห้องพัก</p>';
        } else {
            resultDiv.innerHTML = rooms.map(createRoomHTML).join('');
        }

        showMessage(`พบข้อมูลห้องพัก ${rooms.length} ห้อง`, 'success');

    } catch (error) {
        console.error('Error getting rooms:', error);
        showMessage('เกิดข้อผิดพลาดในการดึงข้อมูลห้องพัก', 'error');
    }
}

// ฟังก์ชันดูห้องว่าง
async function getAvailableRooms() {
    try {
        const availableRooms = mockRooms.filter(room => room.available);

        // สำหรับใช้กับ API จริง (uncomment เมื่อพร้อม)
        /*
        const response = await axios.get(`${API_BASE_URL}?available=true`);
        const availableRooms = response.data;
        */

        const resultDiv = document.getElementById('getRooms');
        if (availableRooms.length === 0) {
            resultDiv.innerHTML = '<p class="no-data">ไม่มีห้องว่างในขณะนี้</p>';
        } else {
            resultDiv.innerHTML = availableRooms.map(createRoomHTML).join('');
        }

        showMessage(`พบห้องว่าง ${availableRooms.length} ห้อง`, 'success');

    } catch (error) {
        console.error('Error getting available rooms:', error);
        showMessage('เกิดข้อผิดพลาดในการดึงข้อมูลห้องว่าง', 'error');
    }
}

// ===== POST Function =====

// ฟังก์ชันเพิ่มห้องพักใหม่
async function addRoom() {
    try {
        const roomName = document.getElementById('postRoomName').value;
        const roomDetail = document.getElementById('postRoomDetail').value;
        const roomImage = document.getElementById('postRoomImage').value;
        const price = document.getElementById('postPrice').value;
        const available = document.getElementById('postAvailable').value === 'true';

        // ตรวจสอบข้อมูล
        if (!roomName || !roomDetail || !roomImage || !price) {
            showMessage('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
            return;
        }

        const newRoom = {
            id: nextId++,
            room_name: roomName,
            room_detail: roomDetail,
            room_image: roomImage,
            price: parseInt(price),
            available: available
        };

        // เพิ่มห้องใหม่ใน mock data
        mockRooms.push(newRoom);

        // สำหรับใช้กับ API จริง (uncomment เมื่อพร้อม)
        /*
        const response = await axios.post(API_BASE_URL, newRoom);
        const addedRoom = response.data;
        */

        const resultDiv = document.getElementById('postResult');
        resultDiv.innerHTML = createRoomHTML(newRoom);

        // เคลียร์ฟอร์ม
        document.getElementById('postRoomName').value = '';
        document.getElementById('postRoomDetail').value = '';
        document.getElementById('postRoomImage').value = '';
        document.getElementById('postPrice').value = '';
        document.getElementById('postAvailable').value = 'true';

        showMessage('เพิ่มห้องพักสำเร็จ', 'success');
        showAllRooms(); // รีเฟรชรายการ

    } catch (error) {
        console.error('Error adding room:', error);
        showMessage('เกิดข้อผิดพลาดในการเพิ่มห้องพัก', 'error');
    }
}

// ===== PUT Function =====

// ฟังก์ชันแก้ไขข้อมูลห้องพัก
async function updateRoom() {
    try {
        const roomId = document.getElementById('putRoomId').value;
        const roomName = document.getElementById('putRoomName').value;
        const roomDetail = document.getElementById('putRoomDetail').value;
        const roomImage = document.getElementById('putRoomImage').value;
        const price = document.getElementById('putPrice').value;
        const availableValue = document.getElementById('putAvailable').value;

        if (!roomId) {
            showMessage('กรุณาระบุ ID ห้องพัก', 'error');
            return;
        }

        // หาห้องที่ต้องการแก้ไข
        const roomIndex = mockRooms.findIndex(r => r.id == roomId);
        if (roomIndex === -1) {
            showMessage('ไม่พบห้องพักที่ระบุ', 'error');
            return;
        }

        // อัพเดทข้อมูล (เฉพาะฟิลด์ที่มีการกรอก)
        const updatedRoom = { ...mockRooms[roomIndex] };
        if (roomName) updatedRoom.room_name = roomName;
        if (roomDetail) updatedRoom.room_detail = roomDetail;
        if (roomImage) updatedRoom.room_image = roomImage;
        if (price) updatedRoom.price = parseInt(price);
        if (availableValue !== '') updatedRoom.available = availableValue === 'true';

        mockRooms[roomIndex] = updatedRoom;

        // สำหรับใช้กับ API จริง (uncomment เมื่อพร้อม)
        /*
        const response = await axios.put(`${API_BASE_URL}/${roomId}`, updatedRoom);
        const updatedRoomFromAPI = response.data;
        */

        const resultDiv = document.getElementById('putResult');
        resultDiv.innerHTML = createRoomHTML(updatedRoom);

        // เคลียร์ฟอร์ม
        document.getElementById('putRoomId').value = '';
        document.getElementById('putRoomName').value = '';
        document.getElementById('putRoomDetail').value = '';
        document.getElementById('putRoomImage').value = '';
        document.getElementById('putPrice').value = '';
        document.getElementById('putAvailable').value = '';

        showMessage('แก้ไขข้อมูลห้องพักสำเร็จ', 'success');
        showAllRooms(); // รีเฟรชรายการ

    } catch (error) {
        console.error('Error updating room:', error);
        showMessage('เกิดข้อผิดพลาดในการแก้ไขข้อมูลห้องพัก', 'error');
    }
}

// ===== PATCH Function =====

// ฟังก์ชันเปลี่ยนสถานะห้อง
async function changeRoomStatus(available) {
    try {
        const roomId = document.getElementById('patchRoomId').value;

        if (!roomId) {
            showMessage('กรุณาระบุ ID ห้องพัก', 'error');
            return;
        }

        // หาห้องที่ต้องการเปลี่ยนสถานะ
        const roomIndex = mockRooms.findIndex(r => r.id == roomId);
        if (roomIndex === -1) {
            showMessage('ไม่พบห้องพักที่ระบุ', 'error');
            return;
        }

        // เปลี่ยนสถานะ
        mockRooms[roomIndex].available = available;

        // สำหรับใช้กับ API จริง (uncomment เมื่อพร้อม)
        /*
        const response = await axios.patch(`${API_BASE_URL}/${roomId}`, { available });
        const updatedRoom = response.data;
        */

        const resultDiv = document.getElementById('patchResult');
        resultDiv.innerHTML = createRoomHTML(mockRooms[roomIndex]);

        const statusText = available ? 'ว่าง' : 'ไม่ว่าง';
        showMessage(`เปลี่ยนสถานะห้อง ${mockRooms[roomIndex].room_name} เป็น${statusText}สำเร็จ`, 'success');
        showAllRooms(); // รีเฟรชรายการ

    } catch (error) {
        console.error('Error changing room status:', error);
        showMessage('เกิดข้อผิดพลาดในการเปลี่ยนสถานะห้อง', 'error');
    }
}

// ===== DELETE Function =====

// ฟังก์ชันลบห้องพัก
async function deleteRoom() {
    try {
        const roomId = document.getElementById('deleteRoomId').value;

        if (!roomId) {
            showMessage('กรุณาระบุ ID ห้องพักที่ต้องการลบ', 'error');
            return;
        }

        // หาห้องที่ต้องการลบ
        const roomIndex = mockRooms.findIndex(r => r.id == roomId);
        if (roomIndex === -1) {
            showMessage('ไม่พบห้องพักที่ระบุ', 'error');
            return;
        }

        const roomName = mockRooms[roomIndex].room_name;

        // ยืนยันการลบ
        if (!confirm(`คุณแน่ใจหรือไม่ที่จะลบห้อง ${roomName}?`)) {
            return;
        }

        // ลบห้อง
        mockRooms.splice(roomIndex, 1);

        // สำหรับใช้กับ API จริง (uncomment เมื่อพร้อม)
        /*
        await axios.delete(`${API_BASE_URL}/${roomId}`);
        */

        const resultDiv = document.getElementById('deleteResult');
        resultDiv.innerHTML = `<p class="success">ลบห้อง ${roomName} สำเร็จ</p>`;

        // เคลียร์ฟอร์ม
        document.getElementById('deleteRoomId').value = '';

        showMessage(`ลบห้อง ${roomName} สำเร็จ`, 'success');
        showAllRooms(); // รีเฟรชรายการ

    } catch (error) {
        console.error('Error deleting room:', error);
        showMessage('เกิดข้อผิดพลาดในการลบห้องพัก', 'error');
    }
}

// ===== Display Functions =====

// ฟังก์ชันแสดงรายการห้องพักทั้งหมด
async function showAllRooms() {
    try {
        const rooms = mockRooms;

        // สำหรับใช้กับ API จริง (uncomment เมื่อพร้อม)
        /*
        const response = await axios.get(API_BASE_URL);
        const rooms = response.data;
        */

        const roomListDiv = document.getElementById('roomList');
        if (rooms.length === 0) {
            roomListDiv.innerHTML = '<p class="no-data">ไม่มีข้อมูลห้องพัก</p>';
        } else {
            const availableCount = rooms.filter(r => r.available).length;
            const occupiedCount = rooms.length - availableCount;

            roomListDiv.innerHTML = `
                <div class="room-summary">
                    <p>ห้องทั้งหมด: ${rooms.length} ห้อง | 
                    ห้องว่าง: <span class="available">${availableCount}</span> ห้อง | 
                    ห้องไม่ว่าง: <span class="occupied">${occupiedCount}</span> ห้อง</p>
                </div>
                <div class="rooms-grid">
                    ${rooms.map(createRoomHTML).join('')}
                </div>
            `;
        }

    } catch (error) {
        console.error('Error showing all rooms:', error);
        showMessage('เกิดข้อผิดพลาดในการแสดงรายการห้องพัก', 'error');
    }
}

// ===== Event Listeners และ Initialization =====

// เมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener('DOMContentLoaded', function () {
    // แสดงรายการห้องพักทั้งหมดตั้งแต่เริ่มต้น
    showAllRooms();

    // เพิ่ม Event Listeners สำหรับ Enter key
    document.getElementById('getRoomId').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') getRooms();
    });

    document.getElementById('patchRoomId').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            // ใช้สถานะ "ว่าง" เป็นค่าเริ่มต้นเมื่อกด Enter
            changeRoomStatus(true);
        }
    });

    document.getElementById('deleteRoomId').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') deleteRoom();
    });

    console.log('Room Management System Loaded');
    console.log('Mock data:', mockRooms);
});

// ===== Utility Functions =====

// ฟังก์ชันสำหรับรีเซ็ตข้อมูล (สำหรับการทดสอบ)
function resetMockData() {
    mockRooms = [
        {
            id: 1,
            room_name: "01/11",
            room_detail: "ห้องสตูดิโอขนาดกว้าง 25 ตร.ม. พร้อมเฟอร์นิเจอร์ครบ มีระเบียง วิวเมือง",
            room_image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
            price: 8500,
            available: true
        },
        {
            id: 2,
            room_name: "02/15",
            room_detail: "ห้อง 1 ห้องนอน ขนาด 35 ตร.ม. มีครัวแยก ห้องน้ำใน วิวสระว่ายน้ำ",
            room_image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
            price: 12000,
            available: true
        },
        {
            id: 3,
            room_name: "03/22",
            room_detail: "ห้องสตูดิโอหรู ขนาด 30 ตร.ม. ตกแต่งสวยงาม เฟอร์นิเจอร์ครบครัน",
            room_image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
            price: 9500,
            available: false
        },
        {
            id: 4,
            room_name: "04/08",
            room_detail: "ห้อง 1 ห้องนอน ขนาด 40 ตร.ม. มีห้องทำงาน ระเบียงใหญ่ วิวแม่น้ำ",
            room_image: "https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=400",
            price: 15000,
            available: true
        },
        {
            id: 5,
            room_name: "05/33",
            room_detail: "ห้องเพนท์เฮาส์ ขนาด 50 ตร.ม. 2 ห้องนอน ห้องรับแขก วิวพาโนรามา",
            room_image: "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=400",
            price: 18000,
            available: false
        }
    ];
    nextId = 6;
    showAllRooms();
    showMessage('รีเซ็ตข้อมูลเรียบร้อย', 'info');
}

// Export functions สำหรับใช้ในกรณีที่ต้องการ import
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getRooms,
        getAvailableRooms,
        addRoom,
        updateRoom,
        changeRoomStatus,
        deleteRoom,
        showAllRooms,
        resetMockData
    };
}

// sidePanel
function openNav() {
  document.getElementById("mySidepanel").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidepanel").style.width = "0";
}