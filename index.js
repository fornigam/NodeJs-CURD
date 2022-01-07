const morgan = require('morgan');
const fs = require('fs')
const path = require('path')
const courses = require('./routes/courses')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const joi = require('joi');

const app = express();
const result = dotenv.config()

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
    name : {type : String, required :true },
    author : String,
    tags : [String],
    date: {type : Date, default: Date.now},
    isPublished : {type: Boolean, required: true },
    price : {type : Number, require : function(){
        return this.isPublished;
    },
    nin : 1,
    max : 200
}
});

const courseModel = mongoose.model('courses',curseScheme);
const course =  new courseModel ({
    name : "Angular",
    author : "Nigam",
    tags : ['node','java'],
    isPublished : true,
    price : 10
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

//Find course data base on id and update the data
const traditionaMethodUpdateCourse = async(id)=>{
    //console.log('calling update'+ id);return;
    const courseData = await courseModel.findById(id)
    if(!courseData){
        console.log('Course is not available');
        return;
    }
    courseData.name = 'Angular 5.21'
    courseData.author = 'Nigam Mehta1'
    courseData.tags = (['PHP3', 'Wordpress3'])
    courseData.save()
    //console.log(courseData);
};


//Find course data base on id and update the data
const deleteCourse = async(id)=>{
    //console.log('calling update'+ id);return;
    const courseData = await courseModel.deleteOne({_id : id})  
    console.log("Delete Course->",courseData);
};

//Using updateOne method
const updateCourseValue = async(id) => {
    console.log("Updated calling");
    const updatedata = await courseModel.updateOne({_id: id}, {
        $set : {
            name: 'Drupal',
            author: 'Np Mehta'
        }, 
    })
    console.log("Update docs",updatedata);
}


(async ()=> {  
    //await dataInsert();
   //await dataAllFetch();
   //traditionaMethodUpdateCourse("61d6c589279eec6259f0503d")
   //updateCourseValue("61d6c589279eec6259f0503d");
   deleteCourse("61d6c589279eec6259f0503d")
   
})();

const port = process.env.port || 3000;
app.listen(port,()=>{
    console.log(`App is running on ${port} port`);
    console.log(process.env.NODE_ENV);
    console.log(app.get('env'));
})