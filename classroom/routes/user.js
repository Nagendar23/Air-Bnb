const express = require('express');
const router = express.Router();


//USERS
//Index -- users
router.get('/',(req,res)=>{
    res.send('get for users');
});

//show --users
router.get('/:id',(req,res)=>{
    res.send('get for show users with id: ');
});

//post -- users
router.post('/',(req,res)=>{
    res.send('post for users');
})
//delete -- users
router.delete('/:id',(req,res)=>{
    res.send('delete for users id');
})

module.exports = router;