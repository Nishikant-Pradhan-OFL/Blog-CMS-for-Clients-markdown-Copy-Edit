const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const isAuthenticated = require('../middleware/auth');

router.get('/', async (req, res) => {
  const posts = await Post.find().sort({ date: -1 });
  res.render('home', { posts, session: req.session });
});

router.get('/post/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render('post', { post, session: req.session });
});

router.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard');
});

router.post('/add-post', isAuthenticated, async (req, res) => {
  const { title, content } = req.body;
  await Post.create({ title, content });
  res.redirect('/');
});

router.get('/edit/:id', isAuthenticated, async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render('edit', { post });
});

router.post('/update/:id', isAuthenticated, async (req, res) => {
  const { title, content } = req.body;
  await Post.findByIdAndUpdate(req.params.id, { title, content });
  res.redirect('/');
});

router.get('/delete/:id', isAuthenticated, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    req.session.user = username;
    res.redirect('/dashboard');
  } else {
    res.render('login', { error: 'Invalid credentials' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;