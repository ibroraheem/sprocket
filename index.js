const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
require('dotenv').config();

app.use(morgan('tiny'));    
app.use(bodyParser.json());
app.use(cors());

connectDB();

app.get('/status', (req, res) => {
    res.send('Hello World!'
    )
})
app.use('/', require('./routes/auth'))

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`)
})

