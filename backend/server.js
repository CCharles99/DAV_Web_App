const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const { imgRouter } = require('./routes/image');
app.use('/image', imgRouter);

const { tcRouter } = require('./routes/tc');
app.use('/tc', tcRouter);

/**
 * Start server
 */
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});