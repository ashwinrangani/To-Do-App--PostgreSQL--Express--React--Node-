import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();

//middlewares

app.use(express.json());
app.use(cors());

//routes

// create a todo

app.post('/todos', async(req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *",[description]);
        res.json(newTodo.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
})

//get all todos
app.get('/todos', async (req,res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo");
        res.json(allTodos.rows);
    } catch (error) {
        console.error(error.message)
    }
})

//get a todo by id 

app.get('/todos/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id=$1", [id]);
        res.json(todo.rows[0]);
    } catch (error) {
        console.error(error.message)
    }
})

//update a todo

app.put('/todos/:id', async (req, res) => {
    try {
        const { description } = req.body;
        const { id } = req.params;
        const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id]);
        res.json("Todo updated")
    } catch (error) {
        console.error(error.message)
    }
})

//delete a todo

app.delete('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
        res.json("Todo deleted")
    } catch (error) {
        console.error(error.message)
    }
})
app.listen(5000, () => {
    console.log('server has started')
})