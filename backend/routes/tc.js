const express = require('express');
const router = express.Router();
const runPythonProcess = require('../runPythonProcess')

router.route('/byDate/:date').get((req, res) => {
    /**
     * returns a list of tcs that exist on a given date
     */
    runPythonProcess('./python_scripts/get_tc_by_date.py', [req.params.date])
        .then(output => {
            output = JSON.parse(output);
            res.status(200).send(output);
        })
        .catch(err => {
            res.status(400).send(err.message)
        });
});

router.route('/byID/:tcID').get((req, res) => {
    /**
     * returns time and latlng data for a given tc by ID
     */
    runPythonProcess('./python_scripts/get_tc_by_id.py', [req.params.tcID])
        .then(output => {
            output = JSON.parse(output);
            res.status(200).send(output);

        })
        .catch(err => {
            res.status(400).send(err.message)
        });
});


module.exports = router;