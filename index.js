const express = require('express');
require('dotenv').config();

const pool = require('./db');

const app = express();

app.use(express.json()); // req.body

// ROUTES

// Get all todos
app.get('/todos', async (req, res) => {
  try {
    const todos = await pool.query('SELECT * FROM todo');
    res.json(todos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Get single todo
app.get('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query('SELECT * FROM todo WHERE todo_id = $1', [
      id,
    ]);
    res.json(todo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Create todo
app.post('/todos', async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      'INSERT INTO todo (description) VALUES ($1) RETURNING *',
      [description]
    );

    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Update todo
app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const updatedTodo = await pool.query(
      'UPDATE todo SET description = $1 WHERE todo_id = $2 RETURNING *',
      [description, id]
    );
    res.json(updatedTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Delete todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await pool.query(
      'DELETE FROM todo WHERE todo_id = $1',
      [id]
    );
    if (deletedTodo.rowCount > 0) {
      res.json(`Successfully deleted todo with id ${id}`);
    } else {
      res.json(`Could not find todo with id ${id}`);
    }
  } catch (err) {
    console.error(err.message);
  }
});

const PORT = process.env.PORT | 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
