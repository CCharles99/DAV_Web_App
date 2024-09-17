const express = require('express');
const router = express.Router();
const fs = require('fs')
const runPythonProcess = require('../runPythonProcess')

const filterData = (data) => {
    return data.map(tc => {
        // strip times of unusable values
        let minValidIndex = tc.time.findIndex(datetime => datetime.substring(5, 7) === '09');
        let maxValidTimeIndex = tc.time.findLastIndex(datetime => datetime.substring(5, 7) === '09');
        // strip lats of unusable values
        let maxValidLatIndex = tc.center.findLastIndex(center => (Math.abs(center[1]) <= 60));
        let maxValidIndex = Math.min(maxValidTimeIndex, maxValidLatIndex);
        
        return maxValidIndex > -1 ? {
            ...tc,
            center: tc.center.slice(minValidIndex, maxValidIndex + 1),
            time: tc.time.slice(minValidIndex, maxValidIndex + 1),
            minFrame: parseInt(tc.time[minValidIndex].substring(11, 13)) * 2 + (tc.time[minValidIndex].substring(14, 16) === '30'),
            maxFrame: parseInt(tc.time[maxValidIndex].substring(11, 13)) * 2 + (tc.time[maxValidIndex].substring(14, 16) === '30')
        } : null;
    }).filter(tc => tc != null);
}

router.route('/byDate/:date').get((req, res) => {
    /**
     * returns a list of tcs that exist on a given date
     */
    runPythonProcess('./python_scripts/get_tc_by_date.py', [req.params.date])
        .then(output => {
            let tcNameIDList = JSON.parse(output);
            runPythonProcess('./python_scripts/get_tc_by_id.py', [JSON.stringify(tcNameIDList.map(tc => tc.id)), req.params.date])
                .then(output => {
                    let tcData = JSON.parse(output);
                    tcData.pop();
                    tcData = tcNameIDList.map((tc, index) => ({ ...tc, ...tcData[index] }));
                    
                    res.status(200).send(filterData(tcData));
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).send(err.message);
                });
        })
        .catch(err => {
            console.log(err);
            res.status(400).send(err.message);
        });
});

router.route('/byID/:tcID').get((req, res) => {
    /**
     * returns time and latlng data for a given tc by ID
     */
    runPythonProcess('./python_scripts/get_tc_by_id.py', [req.params.tcID, null])
        .then(output => {
            output = JSON.parse(output);
            output.pop();
            res.status(200).send(filterData(output));
        })
        .catch(err => {
            console.log(err);
            res.status(400).send(err.message);
        });
});

router.route('/track_dav/:tcID').get((req, res) => {
    fs.readFile('./data/smooth_track_dav.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            res.status(400).send(err.message);
        }
        res.status(200).send(JSON.parse(data)[req.params.tcID])
    });
})

router.route('/track_intensity/:tcID').get((req, res) => {
    fs.readFile('./data/track_intensity.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            res.status(400).send(err.message);
        }
        res.status(200).send(JSON.parse(data)[req.params.tcID])
    });
})

module.exports = router;