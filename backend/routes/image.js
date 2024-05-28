const fs = require('fs')
const express = require('express');
const router = express.Router();

router.route('/:type/:date/:index').get( (req, res) => {
    fs.readFile(`../images/${req.params.type}/${req.params.date}_${req.params.index}.png`, (err, imageData) => {
        if (err) throw err;
        res.send(imageData);
    });
});


module.exports = router;