const fs = require('node:fs')
const express = require('express');
const router = express.Router();

router.route('/').get( (req, res) => {
    fs.readFile(`../images/September 23/DAV-json/2022-09-23_3.json`, 'utf8', (err, data) => {
        if (err) console.log(err);
        console.log(data.length);
        res.json(data);
    });
});

module.exports = router;