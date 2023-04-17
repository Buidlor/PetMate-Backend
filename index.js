const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(server, {
    cors: { origin: '*' }
})


const mongoose = require('mongoose');

require('dotenv').config();
const userRoutes = require('./routes/userRoutes');

const port = process.env.PORT || 4000;
const mongostring = process.env.MONGO_URI;
const localMongostring = process.env.LOCAL_MONGO_URI;


//start server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

//socket.io
io.on('connection', (socket) => {
    console.log('User connected to server: ', socket.id);
    socket.on('join_room', (data) => {
        socket.join(data.room);
        
        console.log(`User with id ${socket.id} joined room: ${data.room}`);
    });

    socket.on('send_message', (data) => {
        console.log('the data is: ' + JSON.stringify(data));
        io.to(data.room).emit('receive_message', data);
        console.log(`Message sent to room ${data.room}: ${JSON.stringify(data)}`);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

//connect to db
const connectDB = async () => {
    try {
        await mongoose.connect(mongostring, { useNewUrlParser: true, useUnifiedTopology: true });
      
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
}
connectDB();

app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
