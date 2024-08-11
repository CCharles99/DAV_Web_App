const fs = require('fs')
const express = require('express');
const router = express.Router();

router.route('/:type/:view/:datetime').get( (req, res) => {
    try {
        let month = req.params.datetime.slice(5,7)
        fs.readFile(`./images/${req.params.type}/${req.params.view}/${month}/${req.params.datetime}.png`, (err, imageData) => {
            res.status(200).send(imageData);
        });

    } catch (err) {
        res.status(404).send({msg: "image not found"})
    }
});


module.exports = router;