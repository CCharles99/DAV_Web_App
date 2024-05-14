const fs = require('fs')
const express = require('express');
const router = express.Router();

router.route('/dav').get( (req, res) => {
    fs.readFile(`../images/September-23/DAV-png/Sep23_1.png`, (err, imageData) => {
        if (err) throw err;
        res.send(imageData);
    });
});

router.route('/ir').get( (req, res) => {
    fs.readFile(`../images/September-23/IR-png/Sep23_1.png`, (err, imageData) => {
        if (err) throw err;
        res.send(imageData);
    });
});

module.exports = router;