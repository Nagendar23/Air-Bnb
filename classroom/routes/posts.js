const express = require('express');
const router = express.Router();

///POSTS
//Index -- posts
router.get('/',(req,res)=>{
    res.send('get for posts');
});

//show --posts
router.get('/:id',(req,res)=>{
    res.send('get for show posts with id: ');
});

//post -- posts
router.post('/',(req,res)=>{
    res.send('post for posts');
})
//delete -- 
router.delete('/:id',(req,res)=>{
    res.send('delete for posts id');
})

module.exports = router;    