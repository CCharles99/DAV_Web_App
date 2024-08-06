const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/image', require('./routes/image'));
app.use('/test', require('./routes/test'));

/**
 * Start server
 */
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});