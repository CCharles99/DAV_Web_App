const fs = require('fs')
const express = require('express');
const router = express.Router();

router.route('/:type/:view/:name/:datetime').get((req, res) => {
    let filePath = `./images/${req.params.type}/${req.params.view}/${req.params.name}/${req.params.datetime}.png`
    fs.readFile(filePath, (err, imageData) => {
        if (err) {
            res.status(404).send(imageData);
        } else {
            res.status(200).send(imageData);
        }
    });
});


module.exports = router;