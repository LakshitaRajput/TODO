require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./models/Todo');

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
}));
app.use(express.json());

app.post('/add', async (req, res) => {
  const task = typeof req.body?.task === 'string' ? req.body.task.trim() : '';
  if (!task) {
    return res.status(400).json({ message: 'Task is required.' });
  }

  try {
    const result = await TodoModel.create({ task });
    return res.json(result);
  } catch (error) {
    console.error('Failed to create task:', error);
    return res.status(500).json({ message: 'Failed to create task.' });
  }
});

app.get('/get', async (req, res) => {
  try {
    const result = await TodoModel.find();
    return res.json(result);
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return res.status(500).json({ message: 'Failed to fetch tasks.' });
  }
});

app.put('/edit/:id', async (req, res) => {
  try {
    const result = await TodoModel.findByIdAndUpdate(
      req.params.id,
      { done: true },
      { new: true }
    );
    if (!result) {
      return res.status(404).json({ message: 'Task not found.' });
    }
    return res.json(result);
  } catch (error) {
    console.error('Failed to mark task complete:', error);
    return res.status(500).json({ message: 'Failed to update task.' });
  }
});

app.put('/update/:id', async (req, res) => {
  const task = typeof req.body?.task === 'string' ? req.body.task.trim() : '';
  if (!task) {
    return res.status(400).json({ message: 'Task is required.' });
  }

  try {
    const result = await TodoModel.findByIdAndUpdate(
      req.params.id,
      { task },
      { new: true, runValidators: true }
    );
    if (!result) {
      return res.status(404).json({ message: 'Task not found.' });
    }
    return res.json(result);
  } catch (error) {
    console.error('Failed to update task:', error);
    return res.status(500).json({ message: 'Failed to update task.' });
  }
});

app.delete('/delete/:id', async (req, res) => {
  try {
    const result = await TodoModel.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Task not found.' });
    }
    return res.json(result);
  } catch (error) {
    console.error('Failed to delete task:', error);
    return res.status(500).json({ message: 'Failed to delete task.' });
  }
});

async function startServer() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI must be set in the environment.');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');

  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

module.exports=app;
