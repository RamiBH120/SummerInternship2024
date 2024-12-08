const jwt = require('jsonwebtoken');
const Message = require('../models/message');
const SECRET_KEY = "secret";

module.exports = (io) => {

    // Middleware for authenticating the token
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;  // Corrected token access
        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }

        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return next(new Error('Authentication error: Invalid token'));
            }
            socket.userId = decoded.id;
            socket.firstName = decoded.firstName;
            next();
        });
    });

    io.on('connection', (socket) => {
        console.log('A user connected', socket.id);

       /* socket.on('sendMessage', async (data) => {
            if (!data.sender || !data.message) {
                return socket.emit('messageSent', { status: 'error', message: 'Missing sender or message data' });
            }

            const newMessage = new Message({
                sender: data.sender,
                message: data.message,
                receiver:data.receiver,
                timestamp: new Date()
            });

            try {
                await newMessage.save();
                socket.emit('messageSent', { status: 'success', messageId: newMessage._id });
                socket.broadcast.emit('receiveMessage', {
                    sender: data.sender,
                    message: data.message,
                    messageId: newMessage._id,
                    timestamp: newMessage.createdAt
                });
            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('messageSent', { status: 'error', message: 'Failed to send message.' });
            }
        });*/
        socket.on('sendMessage', async (data) => {
            if (!data.sender || (!data.message && !data.fileUrl)) {
              return socket.emit('messageSent', { status: 'error', message: 'Message or file is required' });
            }
          
            const newMessage = new Message({
              sender: data.sender,
              receiver: data.receiver,
              message: data.message || '',  // Optional if file is sent
              fileUrl: data.fileUrl || null,  // Optional file URL
              timestamp: new Date(),
            });
          
            try {
              await newMessage.save();
              socket.emit('messageSent', { status: 'success', messageId: newMessage._id });
              socket.broadcast.emit('receiveMessage', {
                sender: data.sender,
                message: data.message,
                fileUrl: data.fileUrl,
                messageId: newMessage._id,
                timestamp: newMessage.createdAt,
              });
            } catch (error) {
              console.error('Error sending message:', error);
              socket.emit('messageSent', { status: 'error', message: 'Failed to send message.' });
            }
          });
          

        socket.on('disconnect', () => {
            console.log('User disconnected', socket.id);
        });
    });
};
