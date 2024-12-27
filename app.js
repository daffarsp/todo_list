// app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Todo = require('./models/Todo');

const app = express();
const PORT = process.env.PORT || 3000;

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
// Halaman Utama
app.get('/', async (req, res) => {
  const todos = await Todo.find();
  res.render('index', { todos });
});

// Halaman Tambah Todo
app.get('/add', (req, res) => res.render('add'));

// Tambah Todo
app.post('/add', async (req, res) => {
  const { title, description } = req.body;
  await Todo.create({ title, description });
  res.redirect('/');
});

// Halaman Edit Todo
app.get('/edit/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  res.render('edit', { todo });
});

// Update Todo
app.post('/edit/:id', async (req, res) => {
  const { title, description, completed } = req.body;
  await Todo.findByIdAndUpdate(req.params.id, { title, description, completed: completed === 'on' });
  res.redirect('/');
});

// Hapus Todo
app.get('/delete/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

// Jalankan Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// Pencarian Todo berdasarkan judul
app.get('/search', async (req, res) => {
    const searchQuery = req.query.q; // Ambil query dari URL
    const todos = await Todo.find({ title: new RegExp(searchQuery, 'i') }); // Pencarian case-insensitive
    res.render('index', { todos });
  });
  
