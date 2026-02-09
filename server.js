// https://www.youtube.com/watch?v=L72fhGm1tfE (Express.js Crash Course)
// https://expressjs.com/en/starter/hello-world.html
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

dotenv.config();

// https://mongoosejs.com/docs/connections.html
const connectDB = require('./config/db');
connectDB();

// https://www.passportjs.org/docs/
require('./config/passport')(passport);

const app = express();
const server = http.createServer(app);

//socket io setup

const io = socketIo(server);
app.set('io', io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const flash = require('connect-flash');

app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use(checkUser);

//middleware config

const { checkUser } = require('./middleware/checkUser');
const notification = require('./middleware/notification');
app.use(notification);


//route definition

app.use('/auth', require('./routes/auth'));
app.use('/chat', require('./routes/chat'));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to IUT Marketplace API', user: req.user });
});

//chat system

const Message = require('./models/Message');

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
    });

    socket.on('chatMessage', async (msg) => {
        const { sender, receiver, content, productId } = msg;

        try {
            // Save message to MongoDB
            const newMessage = await Message.create({
                sender,
                receiver,
                content,
                product: (productId && productId.length > 0) ? productId : null
            });

            // Real-time dispatch
            io.to(receiver).emit('message', newMessage);

            if (sender.toString() !== receiver.toString()) {
                io.to(sender).emit('message', newMessage);
            }
        } catch (err) {
            console.error(err);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
