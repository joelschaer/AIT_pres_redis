const express = require('express');
const app = express();

// Connetion to DB
const MongoClient = require('mongodb').MongoClient;
const mongoUrl = 'mongodb+srv://ait:ait@cluster0-te75z.mongodb.net/admin?retryWrites=true';

// Connection to redis DB
const redisClient = require('redis').createClient;
const redis = redisClient(6379, 'localhost');

const access = require('./access.js');

// changer la variable pour utiliser ou non le caching
const CACHED = true;

app.use(express.json());

MongoClient.connect(mongoUrl, { useNewUrlParser: true } , function (err, client) {
  if (err) throw 'Error connecting to database - ' + err;

  const db = client.db('library');

  app.post('/book', function (req, res) {
    if (!req.body.title || !req.body.author) res.status(400).send("Please send a title and an author for the book");
    else if (!req.body.text) res.status(400).send("Please send some text for the book");
    else {
      access.saveBook(db, req.body.title, req.body.author, req.body.text, function (err) {
        if (err) res.status(500).send("Server error");
        else res.status(201).send("Saved");
      });
    }
  });

  app.get('/book/:title', function (req, res) {
    if (!req.params.title) res.status(400).send("Please send a proper title");
    else {
      if (CACHED) {
        access.findBookByTitleCached(db, redis, req.params.title, function (book) {
          if (!book.text) res.status(500).send("Server error");
          else res.status(200).send(book);
      });
      } else {
        access.findBookByTitle(db, req.params.title, function (book) {
          if (!book.text) res.status(500).send("Server error");
          else res.status(200).send(book);
        });
      }
    }
  });

  app.listen(8000, function () {
    console.log('Listening on port 8000');
  });
});
