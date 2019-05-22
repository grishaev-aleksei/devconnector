const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const {mongoUri} = require('./config/keys');
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');

mongoose.connect(mongoUri, {useNewUrlParser: true})
    .then(() => console.log('successfully connected'))
    .catch(e => console.log(e.message));

const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(passport.initialize());
require('./config/passport')(passport);

app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/profile', profile);






const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server running on port: ${port}`));