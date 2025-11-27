const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const controller = require('../controllers/tasksController')
// List Tasks
router.get('/', controller.list)
// Create Task
router.post('/', [
  body('title').isString().notEmpty().trim().isLength({ max: 255 }),
  body('description').optional().isString(),
  body('status').optional().isIn(['todo','in-progress','done'])
], controller.create)
// Update Task
router.put('/:id', [
  body('title').optional().isString().notEmpty().trim().isLength({ max: 255 }),
  body('description').optional().isString(),
  body('status').optional().isIn(['todo','in-progress','done'])
], controller.update)
// Delete Task
router.delete('/:id', controller.remove)
module.exports = router
