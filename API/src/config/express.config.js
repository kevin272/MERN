const express= require('express')
const router = require ("./router.config")

const app= express();
app.use(router)

module.exports = app;