const mongoose = require('mongoose');
const assert = require('assert');

const url = 'mongodb://localhost/reddit-db';
mongoose.Promise = global.Promise;

mongoose.connect(url,
    {useNewUrlParser: true},
    function(err, db) {
        assert.equal(err, null);
        console.log('Successfully connected to the database');
    }
)

mongoose.connection.on("error", console.error.bind(console, "MongoDB connection Error: "));
mongoose.set('debug', true);

module.exports = mongoose.connection;
