const { default: mongoose } = require("mongoose");

require("dotenv").config();

mongoose.connect(process.env.MONGODB_URL, {
    dbName: process.env.MONGODB_NAME,
    autoCreate: true,
    autoIndex: true
})
.then(() => {
    console.log("DB Server connected successfully..");
})
.catch((err) => {
    console.error(err);
    process.exit(1);
});