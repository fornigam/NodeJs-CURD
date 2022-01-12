const express = require('express');
const { contentSecurityPolicy } = require('helmet');
const users = require('./../model/users')
const router = express.Router();


router.get('/', async (req, res)  =>{
    //res.send('calling');
    const userdata = await users.dataAllFetch();
    res.send(userdata);
    //console.log('Router is calling',JSON.stringify(userdata));
})

router.post('/add', async(req, res) =>{
    
    const userdata = await users.dataInsert(req.body);
    console.log('Responce get',userdata);
    if(userdata){
        res.status(200).send('User is added successfully')
    } else {
        res.status(404).send('User is not added successfully')
    }
})

router.post('/update', async(req, res) =>{
    //console.log('Responce get',req.body);
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
module.exports = router;
