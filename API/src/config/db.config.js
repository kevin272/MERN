const mongoose = require('mongoose');



mongoose.connect(process.env.MONGODB_URl, {
    dbName: process.env.DB_NAME,
    autoCreate: true,
    autoIndex: true,
}).then(() => {
    console.log('Connected to the database');
})
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });