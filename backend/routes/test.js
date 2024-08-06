const express = require('express');
const router = express.Router();
const runPythonProcess = require('../runPythonProcess')

router.route('/py').get((req, res) => {

    runPythonProcess('./python_scripts/test.py', ['arg1', 'arg2'])
        .then(output => {
            res.status(200).send(output);

        })
        .catch(err => {
            res.status(400).send({msg: err.message})
        });
});


module.exports = router;