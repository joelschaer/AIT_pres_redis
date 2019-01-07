var express = require('express'),
    MongoClient = require('mongodb').MongoClient,
    app = express(),
    mongoUrl = 'mongodb+srv://ait:ait@cluster0-bj3cx.mongodb.net/test?retryWrites=true';

MongoClient.connect(mongoUrl, function (err, db) {
    if (err) throw 'Error connecting to database - ' + err;

    app.listen(8000, function () {
        console.log('Listening on port 8000');
    });
});
