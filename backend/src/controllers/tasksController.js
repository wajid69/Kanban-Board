// Task controller using raw SQL queries
const pool = require('../db/connection')
const { validationResult } = require('express-validator')

// GET all tasks
exports.list = async (req, res, next) => {
  try {
    const query = 'SELECT * FROM tasks ORDER BY "createdAt" ASC'
    const result = await pool.query(query)
    res.json(result.rows)
  } catch (err) {
    next(err)
  }
}

// POST create new task
exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const { title, description, status = 'todo' } = req.body
    
    const query = `
      INSERT INTO tasks (title, description, status)
      VALUES ($1, $2, $3)
      RETURNING *
    `
    
    const result = await pool.query(query, [title, description || null, status])
    res.status(201).json(result.rows[0])
  } catch (err) {
    next(err)
  }
}

// PUT update task
exports.update = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const id = req.params.id
    const { title, description, status } = req.body

    const updates = []
    const values = []
    let paramCount = 1

    if (title !== undefined) {
      updates.push(`title = $${paramCount++}`)
      values.push(title)
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`)
      values.push(description)
    }
    if (status !== undefined) {
      updates.push(`status = $${paramCount++}`)
      values.push(status)
    }

    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' })

    updates.push(`"updatedAt" = NOW()`)
    values.push(id)

    const query = `
      UPDATE tasks
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `

    const result = await pool.query(query, values)
    
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) {
    next(err)
  }
}

// DELETE remove task
exports.remove = async (req, res, next) => {
  try {
    const id = req.params.id
    const query = 'DELETE FROM tasks WHERE id = $1'
    const result = await pool.query(query, [id])
    
    if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' })
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
