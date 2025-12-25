const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { maxHttpBufferSize: 1e8 });

app.use(express.static(path.join(__dirname, 'public')));

// بيانات الدخول الخاصة بكما
const users = {
    "alaa": "alaa2006",
    "miloud": "mimo2002"
};

io.on('connection', (socket) => {
    // التحقق من الدخول
    socket.on('login', (data) => {
        const { username, password } = data;
        if (users[username] && users[username] === password) {
            socket.username = username;
            socket.emit('login_success', { username: username });
            socket.broadcast.emit('system_message', `${username} دخل إلى الكوخ ❤️`);
        } else {
            socket.emit('login_error', 'خطأ في الاسم أو كلمة المرور');
        }
    });

    // معالجة الرسائل
    socket.on('chat_message', (data) => {
        io.emit('new_message', data);
    });
});

server.listen(3000, () => console.log('Server running on port 3000'));
