const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const express = require('express');
const Joi = require('joi');
const res = require('express/lib/response');

require('dotenv').config();


const app = express();
//const result = dotenv.config()

mongoose.connect('mongodb://localhost:27017/playground')
    .then(()=>console.log('Connection successfull'))
    .catch(()=>console.log('Error while database connection'))

const userScheme= new mongoose.Schema({
    fname : {type : String, required :true },
    mname : {type : String,},
    lname : {type : String, required :true },
    email : {type : String, required :true,trim: true, unique: true },    
    password : {type : String, required :true,trim: true,maxlength: 1024 }, 
    address : {type : String, required :true },
    city : {type : String, required :true },
    state : {type : String, required :true },
    hobby : [String],
    admin_role : {type : String, required :true },
    user_status : {type : Boolean },
});

const userModel = mongoose.model('users',userScheme);
// const userData =  new userModel ({
//     fname : "Nigam",
//     mname : "Pinakin",
//     lname : "Mehta",
//     email : "fornigam@gmail.com",    
//     address :"SG Highway, Gota",
//     city : "Ahmedabad",
//     state : "Gujarat",
//     hobby : ["Cricket","Music"],
//     admin_role : 1,//1 : for super admin
//     user_status : 1, //1 is for action and 0 is for inactive
// })


const dataInsert = async(req, res, obj)=>{ 
    const salt = await bcrypt.genSalt(10)
    const userData =  new userModel ({
        fname : obj.fname,
        mname : obj.mname,
        lname : obj.lname,
        email : obj.email,
        password : await bcrypt.hash(obj.password, salt),  
        address : obj.address,
        city : obj.city, 
        state : obj.state,
        hobby : obj.hobby,
        admin_role : obj.admin_role,//1 : for super admin
        user_status :  obj.user_status,//1 is for action and 0 is for inactive
    })

    const emailExist = await userModel.findOne({email : obj.email})
    if(emailExist){
        res.status(404).send('Email is already exist.User is not added successfully')
    } else {
        return await userModel(userData).save()
    }
    //if(!obj) return;
    
};

const dataAllFetch = async()=>{
    //For paging : Per page data display
    const perPage = 10;
    //For paging : Page number
    const pageNumber = 1;

    const resultdata = await userModel
        .find()
        //.select({name:1, tags:1})
        //.skip((pageNumber-1) * perPage)
        //.limit(perPage)
    if(!resultdata) {
        console.log('User is now available');
        return 'User is now available'        
    } else {
        console.log('User is available');
        return resultdata;
    }    
};

//Find course data base on id and update the data
const traditionaMethodUpdateUser = async(id)=>{
    const courseData = await userModel.findById(id)
    if(!courseData){
        console.log('User is not available');
        return;
    }
    courseData.fname = 'Angular 5.21'
    courseData.lname = 'Nigam Mehta1'
    courseData.tags = (['PHP3', 'Wordpress3'])
    courseData.save()    
};

//Find course data base on id and update the data
const deleteUser = async(id)=>{
    return courseData = await userModel.deleteOne({_id : id})    
};

//Using updateOne method
const updateUserValue = async(userobj) => {
    const updatedata = await userModel.updateOne({_id: userobj.id}, {
        $set : {
            fname : userobj.fname,
            mname : userobj.mname,
            lname : userobj.lname,
            email : userobj.email,  
            address : userobj.address,
            city : userobj.city, 
            state : userobj.state,
            hobby : userobj.hobby,
            admin_role : userobj.admin_role,//1 : for super admin
            user_status :  userobj.user_status,//1 is for action and 0 is for inactive
        }, 
    })
    return updatedata
}

const login = async(req, res, obj)=> {
   
    const user = await userModel.findOne({ email : obj.email })
       
            //if user not exist than return status 400
            if (!user) return res.status(400).json({ msg: "User not exist" })

            //if user exist than compare password
            //password comes from the user
            //user.password comes from the database
            const bpassword = await bcrypt.compare(obj.password, user.password)
            if(bpassword === true){                
                return user._id;
             } else {
                return res.status(401).json({ msg: "Invalid credencial" })
            }
          
           

       
}

//imediate invoke function
(async ()=> {  
    //await dataInsert();
   //await dataAllFetch();
   //traditionaMethodUpdateUser("61d6c589279eec6259f0503d")
   //updateUserValue("61d6c589279eec6259f0503d");
   //deleteUser("61d6c589279eec6259f0503d")
   
})();


// validation
function isEmailExists(req,res,next) {
    if (email) {
        mongoose.models['users'].findOne({email:email}).then(user=>{
            if(user){
               console.log("Email is already exist");                              
            } else {
                next();
            }
        })        
    }
}


const validateUser = function (user) {
    const schema = Joi.object({
      fname: Joi.string().min(5).max(50),
      email: Joi.string().required().email().min(5).max(255),
      password: Joi.string().required().min(5).max(1024),
    });
  
    return schema.validate(user);
  };

module.exports = {
    dataAllFetch,
    dataInsert,
    updateUserValue,
    deleteUser,
    validateUser,
    login
 }
 
