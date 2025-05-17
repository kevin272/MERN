const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.MONGODB_URL, {
    dbName: process.env.MONGODB_NAME,
    autoCreate: true,
    autoIndex: true,
}).then(() => {
    console.log('Connected to the database');
})
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });