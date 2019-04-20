const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const handlers = require('./handlers/handlers1');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({limit: '20mb', extended: true}));

app.listen(3000, () => {
    console.log('API listening 3000 port')
});
