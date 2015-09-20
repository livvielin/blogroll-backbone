var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/blogroll');

var Schema = mongoose.Schema;

var BlogSchema = new Schema({
  author: String,
  title: String,
  url: String
});

mongoose.model('Blog', BlogSchema);

var Blog = mongoose.model('Blog');

// instantiate blog to test
// var blog = new Blog({
//   author: 'Michael',
//   title: 'Michael\'s Blog',
//   url: 'http://michaelsblog.com'
// });

// save blog to database
// blog.save();


var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

//ROUTES

// create route for url GET request
app.get('/api/blogs', function (req, res) {
  Blog.find(function (err, docs) {
    docs.forEach(function (item) {
      console.log('Received a GET request for _id: ' + item._id);
    });
    res.send(docs);
  });
});

app.post('/api/blogs', function (req, res) {
  console.log('Received a POST request');
  for (var key in req.body) {
    console.log(key + ': ' + req.body[key]);
  }
  var blog = new Blog(req.body); // this needs body-parser
  blog.save(function (err, doc) {
    res.send(doc);
  });
});

app.delete('/api/blog/:id', function (req, res) {
  console.log('Received a DELETE request for _id: ' + req.params.id);
  Blog.remove({ _id: req.params.id }, function (err) {
    res.send({ _id: req.params.id });
  });
});

app.put('/api/blog/:id', function (req, res) {
  console.log('Received an UPDATE request for _id: ' + req.params.id);
  Blog.update({ _id: req.params.id }, req.body, function (err) {
    res.send({ _id: req.params.id });
  });
});

var port = 3000;

app.listen(port);
console.log('server on ' + port);
