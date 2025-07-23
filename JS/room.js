const API_BASE_URL = 'http://localhost:3300';

        // กำหนดค่า axios เริ่มต้น
        axios.defaults.baseURL = API_BASE_URL;
        axios.defaults.timeout = 10000; // 10 วินาที
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
            const image = document.getElementById('postRoomImage').value;
            const price = document.getElementById('postPrice').value;
            const available = document.getElementById('postAvailable').value === 'true';
            
            if (!name || !detail || !image || !price) {
                showMessage("กรุณากรอกข้อมูลให้ครบถ้วน", true);
                return;
            }
            
            try {
                const response = await axios.post('/rooms', {
                    name: name,
                    detail: detail,
                    image: image,
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
            const image = document.getElementById('putRoomImage').value;
            const price = document.getElementById('putPrice').value;
            const available = document.getElementById('putAvailable').value;
            
            if (!id) {
                showMessage("กรุณากรอก ID ห้องพัก", true);
                return;
            }
            
            const updateData = {};
            if (name) updateData.name = name;
            if (detail) updateData.detail = detail;
            if (image) updateData.image = image;
            if (price) updateData.price = parseFloat(price);
            if (available !== '') updateData.available = available === 'true';
            
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