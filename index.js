const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 3000;
const mongostring = process.env.MONGO_URI;



//start server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

//connect to db
const connectDB = async () => {
    try {
        await mongoose.connect(mongostring, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true,
         });
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
