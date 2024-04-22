const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    console.log('request made')
    res.json('hello world')
})

module.exports = router;