const express = require('express');
const mongoose = require('mongoose');
const {mongoUri} = require('./config/keys');

mongoose.connect(mongoUri, {useNewUrlParser: true})
    .then(() => console.log('successfully connected'))
    .catch(e => console.log(e.message));


const app = express();


app.get('/', (req, res) => res.send('Hello world'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server running on port: ${port}`));