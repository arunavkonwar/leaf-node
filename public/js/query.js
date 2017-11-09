var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/leaf-nodekb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var query = { title: 'nadal' };
  db.collection("articles").find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
});
