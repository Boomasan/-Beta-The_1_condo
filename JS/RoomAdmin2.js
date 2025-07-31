const API_BASE_URL = 'http://localhost:3300';

        // กำหนดค่า axios เริ่มต้น
        axios.defaults.baseURL = API_BASE_URL;
        axios.defaults.timeout = 10000;
        axios.defaults.headers.common['Content-Type'] = 'application/json';

        // Interceptor สำหรับ request
        axios.interceptors.request.use(
            (config) => {
                console.log(`Making ${config.method.toUpperCase()} request to: ${config.url}`);
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Interceptor สำหรับ response
        axios.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                console.error('API Error:', error);
                if (error.code === 'ECONNABORTED') {
                    showMessage("การเชื่อมต่อหมดเวลา กรุณาลองใหม่อีกครั้ง", true);
                } else if (error.response) {
                    showMessage(`เกิดข้อผิดพลาด: ${error.response.status} - ${error.response.statusText}`, true);
                } else if (error.request) {
                    showMessage("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้", true);
                } else {
                    showMessage("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ", true);
                }
                return Promise.reject(error);
            }
        );

        // Utility function to show messages
        function showMessage(message, isError = false) {
            const msgDiv = document.getElementById('message');
            msgDiv.className = `message ${isError ? 'error' : 'success'}`;
            msgDiv.textContent = message;
            msgDiv.style.display = 'block';
            setTimeout(() => {
                msgDiv.style.display = 'none';
            }, 5000);
        }

        // Utility function to show loading
        function showLoading(elementId) {
            document.getElementById(elementId).innerHTML = '<div class="loading">กำลังโหลด...</div>';
            document.getElementById(elementId).style.display = 'block';
        }

        // Function to convert file to base64
        function fileToBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        }

        // Function to show image preview
            function showImagePreview(file, previewId) {
                const previewDiv = document.getElementById(previewId);
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        previewDiv.innerHTML = `
                        <img src="${e.target.result}" 
                            style="max-width: 200px; max-height: 150px; border-radius: 6px; border: 1px solid #ccc;"
                            alt="ตัวอย่างรูปภาพ">
                        <p style="font-size: 12px; color: #666; margin-top: 5px;">
                            ขนาดไฟล์: ${(file.size / 1024).toFixed(1)} KB
                        </p>
                        `;
                    };
                reader.readAsDataURL(file);
                } else {
                previewDiv.innerHTML = '';
                }
            }

            document.addEventListener('DOMContentLoaded', function () {
                const postInput = document.getElementById('postRoomImage');
                const putInput = document.getElementById('putRoomImage');

                if (postInput) {
                    postInput.addEventListener('change', function (e) {
                        const file = e.target.files[0];
                        showImagePreview(file, 'imagePreview');
                    });
                }

                if (putInput) {
                    putInput.addEventListener('change', function (e) {
                        const file = e.target.files[0];
                        showImagePreview(file, 'updateImagePreview');
                });
                }
        });

        // Event listeners for file inputs
        document.getElementById('postRoomImage').addEventListener('change', function(e) {
            const file = e.target.files[0];
            showImagePreview(file, 'imagePreview');
        });

        document.getElementById('putRoomImage').addEventListener('change', function(e) {
            const file = e.target.files[0];
            showImagePreview(file, 'updateImagePreview');
        });

        // GET - ดูข้อมูลห้องพัก
        async function getRooms() {
            const roomId = document.getElementById('getRoomId').value;
            const resultDiv = document.getElementById('getRooms');
            
            showLoading('getRooms');
            
            try {
                let url = '/rooms';
                if (roomId) {
                    url += `/${roomId}`;
                }
                
                const response = await axios.get(url);
                const result = response.data;
                
                resultDiv.style.display = 'block';
                
                if (result.success) {
                    if (roomId) {
                        // Single room
                        const room = result.data;
                        resultDiv.innerHTML = `
                            <div class="room-card ${!room.available ? 'unavailable' : ''}">
                                <h4>ห้อง ${room.name}</h4>
                                <img src="${room.image}" alt="Room ${room.name}" class="room-image" onerror="this.style.display='none'">
                                <p><strong>รายละเอียด:</strong> ${room.detail}</p>
                                <p><strong>ราคา:</strong> ${room.price} บาท/เดือน</p>
                                <p><strong>สถานะ:</strong> <span style="color: ${room.available ? '#4caf50' : '#f44336'};">${room.available ? 'ว่าง' : 'ไม่ว่าง'}</span></p>
                            </div>
                        `;
                    } else {
                        // All rooms summary
                        const rooms = result.data;
                        const availableCount = rooms.filter(room => room.available).length;
                        resultDiv.innerHTML = `
                            <p><strong>จำนวนห้องทั้งหมด:</strong> ${result.count} ห้อง</p>
                            <p><strong>ห้องว่าง:</strong> ${availableCount} ห้อง</p>
                            <p><strong>ห้องไม่ว่าง:</strong> ${result.count - availableCount} ห้อง</p>
                        `;
                    }
                } else {
                    resultDiv.innerHTML = `<p style="color: #f44336;">${result.message}</p>`;
                }
            } catch (error) {
                resultDiv.innerHTML = `<p style="color: #f44336;">เกิดข้อผิดพลาด: ${error.message}</p>`;
            }
        }

        // GET - ดูห้องที่ว่าง
        async function getAvailableRooms() {
            const resultDiv = document.getElementById('getRooms');
            
            showLoading('getRooms');
            
            try {
                const response = await axios.get('/rooms/available');
                const result = response.data;
                
                resultDiv.style.display = 'block';
                
                if (result.success) {
                    if (result.data.length > 0) {
                        let html = `<h4>ห้องว่าง (${result.count} ห้อง)</h4>`;
                        result.data.forEach(room => {
                            html += `
                                <div class="room-card">
                                    <strong>ห้อง ${room.name}</strong> - ${room.price} บาท/เดือน<br>
                                    ${room.detail}
                                </div>
                            `;
                        });
                        resultDiv.innerHTML = html;
                    } else {
                        resultDiv.innerHTML = '<p>ไม่มีห้องว่างในขณะนี้</p>';
                    }
                } else {
                    resultDiv.innerHTML = `<p style="color: #f44336;">${result.message}</p>`;
                }
            } catch (error) {
                resultDiv.innerHTML = `<p style="color: #f44336;">เกิดข้อผิดพลาด: ${error.message}</p>`;
            }
        }

        // POST - เพิ่มห้องพักใหม่
        async function addRoom() {
            const name = document.getElementById('postRoomName').value;
            const detail = document.getElementById('postRoomDetail').value;
            const imageFile = document.getElementById('postRoomImage').files[0];
            const price = document.getElementById('postPrice').value;
            const available = document.getElementById('postAvailable').value === 'true';
            
            if (!name || !detail || !imageFile || !price) {
                showMessage("กรุณากรอกข้อมูลและเลือกรูปภาพให้ครบถ้วน", true);
                return;
            }

            // Check file size (limit to 5MB)
            if (imageFile.size > 5 * 1024 * 1024) {
                showMessage("ขนาดไฟล์รูปภาพต้องไม่เกิน 5MB", true);
                return;
            }
            
            try {
                // Convert image to base64
                const imageBase64 = await fileToBase64(imageFile);
                
                const response = await axios.post('/rooms', {
                    name: name,
                    detail: detail,
                    image: imageBase64,
                    price: parseFloat(price),
                    available: available
                });
                
                const result = response.data;
                const resultDiv = document.getElementById('postResult');
                
                resultDiv.style.display = 'block';
                
                if (result.success) {
                    resultDiv.innerHTML = `
                        <p style="color: #4caf50;">${result.message}</p>
                        <p>ห้อง: ${result.data.name} | ราคา: ${result.data.price} บาท/เดือน</p>
                    `;
                    
                    // Clear form
                    document.getElementById('postRoomName').value = '';
                    document.getElementById('postRoomDetail').value = '';
                    document.getElementById('postRoomImage').value = '';
                    document.getElementById('postPrice').value = '';
                    document.getElementById('postAvailable').value = 'true';
                    document.getElementById('imagePreview').innerHTML = '';
                    
                    showAllRooms();
                    showMessage(result.message);
                } else {
                    resultDiv.innerHTML = `<p style="color: #f44336;">${result.message}</p>`;
                    showMessage(result.message, true);
                }
            } catch (error) {
                const resultDiv = document.getElementById('postResult');
                resultDiv.style.display = 'block';
                if (error.response && error.response.data) {
                    resultDiv.innerHTML = `<p style="color: #f44336;">${error.response.data.message || 'เกิดข้อผิดพลาด'}</p>`;
                }
            }
        }

        // PUT - แก้ไขข้อมูลห้องพัก
        async function updateRoom() {
            const id = document.getElementById('putRoomId').value;
            const name = document.getElementById('putRoomName').value;
            const detail = document.getElementById('putRoomDetail').value;
            const imageFile = document.getElementById('putRoomImage').files[0];
            const price = document.getElementById('putPrice').value;
            const available = document.getElementById('putAvailable').value;
            
            if (!id) {
                showMessage("กรุณากรอก ID ห้องพัก", true);
                return;
            }

            // Check file size if image is selected
            if (imageFile && imageFile.size > 5 * 1024 * 1024) {
                showMessage("ขนาดไฟล์รูปภาพต้องไม่เกิน 5MB", true);
                return;
            }
            
            const updateData = {};
            if (name) updateData.name = name;
            if (detail) updateData.detail = detail;
            if (price) updateData.price = parseFloat(price);
            if (available !== '') updateData.available = available === 'true';
            
            // Add image if selected
            if (imageFile) {
                try {
                    updateData.image = await fileToBase64(imageFile);
                } catch (error) {
                    showMessage("เกิดข้อผิดพลาดในการอ่านไฟล์รูปภาพ", true);
                    return;
                }
            }
            
            try {
                const response = await axios.put(`/rooms/${id}`, updateData);
                const result = response.data;
                const resultDiv = document.getElementById('putResult');
                
                resultDiv.style.display = 'block';
                
                if (result.success) {
                    resultDiv.innerHTML = `
                        <p style="color: #4caf50;">${result.message}</p>
                        <p>ห้อง: ${result.data.name} | ราคา: ${result.data.price} บาท/เดือน</p>
                    `;
                    
                    // Clear form
                    document.getElementById('putRoomImage').value = '';
                    document.getElementById('updateImagePreview').innerHTML = '';
                    
                    showAllRooms();
                    showMessage(result.message);
                } else {
                    resultDiv.innerHTML = `<p style="color: #f44336;">${result.message}</p>`;
                    showMessage(result.message, true);
                }
            } catch (error) {
                const resultDiv = document.getElementById('putResult');
                resultDiv.style.display = 'block';
                if (error.response && error.response.data) {
                    resultDiv.innerHTML = `<p style="color: #f44336;">${error.response.data.message || 'เกิดข้อผิดพลาด'}</p>`;
                }
            }
        }

        // PATCH - เปลี่ยนสถานะห้อง
        async function changeRoomStatus(available) {
            const id = document.getElementById('patchRoomId').value;
            
            if (!id) {
                showMessage("กรุณากรอก ID ห้องพัก", true);
                return;
            }
            
            try {
                const response = await axios.patch(`/rooms/${id}/status`, { 
                    available: available 
                });
                
                const result = response.data;
                const resultDiv = document.getElementById('patchResult');
                
                resultDiv.style.display = 'block';
                
                if (result.success) {
                    resultDiv.innerHTML = `<p style="color: #4caf50;">${result.message}</p>`;
                    showAllRooms();
                    showMessage(result.message);
                } else {
                    resultDiv.innerHTML = `<p style="color: #f44336;">${result.message}</p>`;
                    showMessage(result.message, true);
                }
            } catch (error) {
                const resultDiv = document.getElementById('patchResult');
                resultDiv.style.display = 'block';
                if (error.response && error.response.data) {
                    resultDiv.innerHTML = `<p style="color: #f44336;">${error.response.data.message || 'เกิดข้อผิดพลาด'}</p>`;
                }
            }
        }

        // DELETE - ลบห้องพัก
        async function deleteRoom() {
            const id = document.getElementById('deleteRoomId').value;
            
            if (!id) {
                showMessage("กรุณากรอก ID ห้องพัก", true);
                return;
            }
            
            if (!confirm('ต้องการลบห้องพักนี้หรือไม่?')) {
                return;
            }
            
            try {
                const response = await axios.delete(`/rooms/${id}`);
                const result = response.data;
                const resultDiv = document.getElementById('deleteResult');
                
                resultDiv.style.display = 'block';
                
                if (result.success) {
                    resultDiv.innerHTML = `<p style="color: #4caf50;">${result.message}</p>`;
                    document.getElementById('deleteRoomId').value = '';
                    showAllRooms();
                    showMessage(result.message);
                } else {
                    resultDiv.innerHTML = `<p style="color: #f44336;">${result.message}</p>`;
                    showMessage(result.message, true);
                }
            } catch (error) {
                const resultDiv = document.getElementById('deleteResult');
                resultDiv.style.display = 'block';
                if (error.response && error.response.data) {
                    resultDiv.innerHTML = `<p style="color: #f44336;">${error.response.data.message || 'เกิดข้อผิดพลาด'}</p>`;
                }
            }
        }

        // แสดงรายการห้องทั้งหมด
        async function showAllRooms() {
            const roomListDiv = document.getElementById('roomList');
            roomListDiv.innerHTML = '<div class="loading">กำลังโหลดรายการห้อง...</div>';
            
            try {
                const response = await axios.get('/rooms');
                const result = response.data;
                
                if (result.success && result.data.length > 0) {
                    let html = '';
                    result.data.forEach(room => {
                        html += `
                            <div class="room-card ${!room.available ? 'unavailable' : ''}">
                                <h4>ID: ${room.id} | ห้อง ${room.name}</h4>
                                <img src="${room.image}" alt="Room ${room.name}" class="room-image" onerror="this.style.display='none'">
                                <p><strong>รายละเอียด:</strong> ${room.detail}</p>
                                <p><strong>ราคา:</strong> ${room.price} บาท/เดือน</p>
                                <p><strong>สถานะ:</strong> <span style="color: ${room.available ? '#4caf50' : '#f44336'}; font-weight: bold;">${room.available ? 'ว่าง' : 'ไม่ว่าง'}</span></p>
                                <button onclick="fillUpdateForm(${room.id}, '${room.name}', \`${room.detail}\`, ${room.price}, ${room.available})" style="margin-right: 10px;">แก้ไข</button>
                                <button onclick="quickDelete(${room.id})" style="background-color: #f44336;">ลบ</button>
                            </div>
                        `;
                    });
                    roomListDiv.innerHTML = html;
                } else if (result.success) {
                    roomListDiv.innerHTML = '<p style="text-align: center;">ไม่มีข้อมูลห้องพัก</p>';
                } else {
                    roomListDiv.innerHTML = `<p style="color: #f44336;">${result.message}</p>`;
                }
            } catch (error) {
                roomListDiv.innerHTML = '<p style="color: #f44336;">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>';
            }
        }

        // ฟังก์ชันช่วยเหลือ
        function fillUpdateForm(id, name, detail, price, available) {
            document.getElementById('putRoomId').value = id;
            document.getElementById('putRoomName').value = name;
            document.getElementById('putRoomDetail').value = detail;
            document.getElementById('putPrice').value = price;
            document.getElementById('putAvailable').value = available.toString();
            
            // Clear image inputs
            document.getElementById('putRoomImage').value = '';
            document.getElementById('updateImagePreview').innerHTML = '';
            
            // Scroll to update section
            document.querySelector('#putRoomId').scrollIntoView({ behavior: 'smooth' });
        }

        async function quickDelete(id) {
            if (confirm('ต้องการลบห้องพักนี้หรือไม่?')) {
                document.getElementById('deleteRoomId').value = id;
                await deleteRoom();
            }
        }

        // Health check สำหรับตรวจสอบการเชื่อมต่อ API
        async function checkAPIConnection() {
            try {
                const response = await axios.get('/health');
                const result = response.data;
                if (result.success) {
                    console.log('API connection successful');
                    showMessage("เชื่อมต่อ API Server สำเร็จ");
                }
            } catch (error) {
                console.error('API connection failed:', error);
                showMessage("ไม่สามารถเชื่อมต่อกับ API Server ได้ กรุณาตรวจสอบว่า Server ทำงานอยู่ที่ port 3300", true);
            }
        }

        // โหลดข้อมูลเริ่มต้น
        document.addEventListener('DOMContentLoaded', function() {
            checkAPIConnection();
            showAllRooms();
        });