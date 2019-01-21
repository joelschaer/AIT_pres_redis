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
        if (err == 'exist') res.status(400).send("Book already exists");
        else if (err) res.status(500).send("Server error");
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
          if (!book) res.status(500).send("Server error");
          else res.status(200).send(book);
        });
      }
    }
  });

  app.put('/book/:title', function (req, res) {
    if (!req.params.title) res.status(400).send("Please send the book title");
    else if (!req.body.text) res.status(400).send("Please send the new text");
    else {
        access.updateBookByTitle(db, redis, req.params.title, req.body.text, function (err) {
            if (err == "Missing book") res.status(404).send("Book not found");
            else if (err) res.status(500).send("Server error");
            else res.status(200).send("Updated");
        });
    }
});

  app.listen(8000, function () {
    console.log('Listening on port 8000');
  });
});
