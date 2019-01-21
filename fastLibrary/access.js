const access = require('./access.js');

module.exports.saveBook = function (db, title, author, text, callback) {
  access.findBookByTitle(db, title, function (book) {
    if(!book){
      db.collection('book').insertOne({
        title: title,
        author: author,
        text: text
      }, callback);
    }
    else {
      callback('exist');
    }
  });
  
};

// version sans cache
module.exports.findBookByTitle = function (db, title, callback) {
  db.collection('book').findOne({
    title: title
  }, function (err, doc) {
    if (err || !doc) callback(null);
    else callback(doc);
  });
};

//version avec cache
module.exports.findBookByTitleCached = function (db, redis, title, callback) {
  redis.get(title, function (err, reply) {
    if (err) callback(null);
    else if (reply) //Book exists in cache
      callback(JSON.parse(reply));
    else {
      //Book doesn't exist in cache - we need to query the main database
      db.collection('book').findOne({
        title: title
      }, function (err, doc) {
        if (err || !doc) callback(null);
        else {
          //Book found in database, save to cache and return to client
          redis.set(title, JSON.stringify(doc), function () {
            callback(doc);
          });
        }
      });
    }
  });
};

// update a book and update it in the cache
module.exports.updateBookByTitle = function (db, redis, title, newText, callback) {
  db.collection('book').findOneAndUpdate({
      title: title
  }, {
      $set: {
          text: newText
      }
  },{ 
    returnOriginal:false
  }, function (err, doc) { //Update the main database
      if (err) callback(err);
      else if (!doc) callback('Missing book');
      else {
          //Save new book version to cache
          redis.set(title, JSON.stringify(doc.value), function (err) {
              if (err) callback(err);
              else callback(null);
          });
      }
  });
};