const fs = require('fs')
const express = require('express');
const router = express.Router();

router.route('/:type/:view/:date/:index').get( (req, res) => {
    try {
        fs.readFile(`./images/${req.params.type}/${req.params.view}/${req.params.date}_${req.params.index}.png`, (err, imageData) => {
            res.status(200).send(imageData);
        });

    } catch (err) {
        res.status(404).send({msg: "image not found"})
    }
});


module.exports = router;