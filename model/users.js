const mongoose = require('mongoose');
const express = require('express');


const app = express();
//const result = dotenv.config()

mongoose.connect('mongodb://localhost:27017/playground')
    .then(()=>console.log('Connection successfull'))
    .catch(()=>console.log('Error while database connection'))

const userScheme= new mongoose.Schema({
    fname : {type : String, required :true },
    mname : {type : String,},
    lname : {type : String, required :true },
    email : {type : String, required :true,trim: true
    },    
    address : {type : String, required :true },
    city : {type : String, required :true },
    state : {type : String, required :true },
    hobby : [String],
    admin_role : {type : String, required :true },
    user_status : {type : Boolean },
});

const userModel = mongoose.model('users',userScheme);
const userData =  new userModel ({
    fname : "Nigam",
    mname : "Pinakin",
    lname : "Mehta",
    email : "fornigam@gmail.com",    
    address :"SG Highway, Gota",
    city : "Ahmedabad",
    state : "Gujarat",
    hobby : ["Cricket","Music"],
    admin_role : 1,//1 : for super admin
    user_status : 1, //1 is for action and 0 is for inactive
})

const dataInsert = async(obj)=>{ 
    const userData =  new userModel ({
        fname : obj.fname,
        mname : obj.mname,
        lname : obj.lname,
        email : obj.email,  
        address : obj.address,
        city : obj.city, 
        state : obj.state,
        hobby : obj.hobby,
        admin_role : obj.admin_role,//1 : for super admin
        user_status :  obj.user_status,//1 is for action and 0 is for inactive
    })
    //console.log("Calling insert",obj);
    //if(!obj) return;
    return await userModel(userData).save()
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

module.exports = {
    dataAllFetch,
    dataInsert,
    updateUserValue,
    deleteUser

 }
 
