//const morgan = require('morgan');
//const fs = require('fs')
const path = require('path')
const express = require('express');
//const courses = require('./routes/courses')
const users = require('./routes/users')
//const usersModel = require('./model/users')
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//const joi = require('joi');
//const { boolean } = require('joi');
//const { nextTick } = require('process');

const app = express();
const result = dotenv.config()

//Middleware declaration
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
//app.use('/api/courses',courses)
app.use('/api/users',users)

//Morgan usage and log inserted to file
// var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
// app.use(morgan('combined', { stream: accessLogStream }))

const port = process.env.port || 3000;
app.listen(port,()=>{
    console.log(`App is running on ${port} port`);
    console.log(process.env.NODE_ENV);
    console.log(app.get('env'));
})