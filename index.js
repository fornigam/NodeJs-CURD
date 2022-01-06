//const morgan = require('morgan');
const fs = require('fs')
const path = require('path')
const courses = require('./routes/courses')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');

const app = express();
//const result = dotenv.config()

//Middleware declaration
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use('/api/courses',courses)

//Morgan usage and log inserted to file
// var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
// app.use(morgan('combined', { stream: accessLogStream }))

mongoose.connect('mongodb://localhost:27017/playground')
    .then(()=>console.log('Connection successfull'))
    .catch(()=>console.log('Error while database connection'))

const curseScheme= new mongoose.Schema({
    name : String,
    author : String,
    tags : [String],
    date: {type : Date, default: Date.now},
    isPublished : Boolean
});

const courseModel = mongoose.model('courses',curseScheme);
const course =  new courseModel ({
    name : "NodeJs",
    author : "Nigam",
    tags : ['node','java'],
    isPublished : true
})

const dataInsert = async()=>{     
    const resultdata = await course.save();
    console.log(`Db inserted : ${resultdata}`);
};

const dataAllFetch = async()=>{
    const perPage = 10;
    const pageNumber = 1;
    const resultdata = await courseModel
        .find()
        .select({name:1, tags:1})
        .skip((pageNumber-1) * perPage)
        .limit(perPage)
    console.log(`Data from database is: ${resultdata}`);
};

(async ()=> {  
    //await dataInsert();
   await dataAllFetch();
})();

const port = process.env.port || 3000;
app.listen(port,()=>{
    console.log(`App is running on ${port} port`);
    console.log(process.env.NODE_ENV);
    console.log(app.get('env'));
})