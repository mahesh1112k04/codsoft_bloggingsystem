const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Set up the schema and model
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});
const Post = mongoose.model('Post', postSchema);

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Define routes
app.get('/', (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) {
      console.error(err);
    } else {
      res.render('index', { posts });
    }
  });
});

app.get('/new', (req, res) => {
  res.render('new');
});

app.post('/new', (req, res) => {
  const { title, content } = req.body;
  const post = new Post({ title, content });
  post.save((err) => {
    if (err) {
      console.error(err);
    } else {
      res.redirect('/');
    }
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
