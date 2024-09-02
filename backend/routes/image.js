const fs = require('fs')
const express = require('express');
const router = express.Router();
const runPythonProcess = require('../runPythonProcess')


router.route('/:type/:view/:name/:datetime').get((req, res) => {
    let filePath = `./images/${req.params.type}/${req.params.view}/${req.params.name}/${req.params.datetime}.png`;
    fs.readFile(filePath, (err, imageData) => {
        if (err) {
            res.status(404).send(err);
        } else {
            res.status(200).send(imageData);
        }
    });
});

router.route('/track/id/:tcIDName').get((req, res) => {
    let filePath = `./images/TRACKS/TC/${req.params.tcIDName}.png`;
    fs.readFile(filePath, (err, imageData) => {
        if (err) {
            res.status(404).send(err);
        } else {
            res.status(200).send(imageData);
        }
    });
});

router.route('/track/date/:date').post((req, res) => {
    runPythonProcess('./python_scripts/merge_tracks.py', [req.params.date, JSON.stringify(req.body.tcList)])
        .then(output => res.status(200).send(output))
        .catch(err => res.status(400).send(err.message));
});

router.route('/track/date/:date').get((req, res) => {
    let filePath = `./images/Tracks/DATE/${req.params.date}.png`;
    fs.readFile(filePath, (err, imageData) => {
        if (err) {
            res.status(404).send(err);
        } else {
            res.status(200).send(imageData);
        }
    });
});


module.exports = router;