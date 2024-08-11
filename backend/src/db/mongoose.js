const mongoose = require('mongoose');
//configuring the path to .env file
const path = require('path');
const envPath = path.join(__dirname, '..','env','.env');
require('dotenv').config({path : envPath});

const url = process.env.URL;
const con = mongoose.connection;
mongoose.connect(url);
con.on('open' , () => {
    console.log("database connected");
})

con.on('error', (err) => {
    console.log(err);
})
