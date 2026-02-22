const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all task routes
router.use(authMiddleware);

// GET /api/tasks
router.get('/', async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await db.query('SELECT * FROM tasks WHERE user_id = $1 ORDER BY id ASC', [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error while fetching tasks.' });
    }
});

// POST /api/tasks
router.post('/', async (req, res) => {
    try {
        const userId = req.user.userId;
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required for a new task.' });
        }

        const result = await db.query(
            'INSERT INTO tasks (title, description, status, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, description || '', false, userId]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error while creating task.' });
    }
});

// PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
    try {
        const userId = req.user.userId;
        const taskId = req.params.id;
        const { title, description, status } = req.body;

        // Check if task exists and belongs to user
        const taskCheck = await db.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [taskId, userId]);

        if (taskCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found or you do not have permission to update it.' });
        }

        const currentTask = taskCheck.rows[0];
        const updateTitle = title !== undefined ? title : currentTask.title;
        const updateDescription = description !== undefined ? description : currentTask.description;
        const updateStatus = status !== undefined ? status : currentTask.status;

        const result = await db.query(
            'UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
            [updateTitle, updateDescription, updateStatus, taskId, userId]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error while updating task.' });
    }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.user.userId;
        const taskId = req.params.id;

        // Perform delete where id AND user_id matches
        const result = await db.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *', [taskId, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found or you do not have permission to delete it.' });
        }

        res.json({ message: 'Task deleted successfully', deletedTask: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error while deleting task.' });
    }
});

module.exports = router;
