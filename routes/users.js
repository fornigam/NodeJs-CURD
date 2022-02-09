const express = require('express');
const mongoose = require('mongoose');
const { contentSecurityPolicy } = require('helmet');
const users = require('./../model/users');
const middleware = require('./../middleware/auth');

const router = express.Router();
const jwt = require('jsonwebtoken');


router.get('/', middleware.auth, async (req, res)  =>{
    //res.send('calling');
    console.log('calling');
    const userdata = await users.dataAllFetch();
    res.send(userdata);
    //console.log('Router is calling',JSON.stringify(userdata));
})

router.post('/add', async(req, res) =>{
    const { error } = users.validateUser({fname : req.body.fname, email : req.body.email, password :req.body.password});
    if(error) return res.status(404).send(error)
    
    const userdata = await users.dataInsert(req, res, req.body);
    console.log('Responce get',userdata);
    if(userdata){
        res.status(200).send('User is added successfully')
    } else {
        res.status(404).send('Email is already exist.User is not added successfully')
    }
})
router.post('/update', async(req, res) =>{    
    const userupdatedata = await users.updateUserValue(req.body);
    if(userupdatedata){
        res.status(200).send('User is updated successfully.')
    } else {
        res.status(400).send('User is not updated.')
    } 
})
router.post('/delete', async(req, res) =>{    
    const userdeletdata = await users.deleteUser(req.body.id);
        if(userdeletdata){
        res.status(200).send('User is deleted successfully.')
    } else {
        res.status(400).send('User is not deleted.')
    } 
})

router.post('/login', async(req, res) =>{
    const loginData = await users.login(req, res, req.body); 
    if(loginData != null ) {
        const token = jwt.sign({_id :loginData }, process.env.jwttokenprovatekey)
        res.header('x-auth-token',token).send(loginData)
    }  
    console.log("loging data->",loginData.uid); 
   
})
module.exports = router;
