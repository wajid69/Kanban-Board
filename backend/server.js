// Load environment variables
require('dotenv').config()

// Import dependencies
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const { initializeDatabase } = require('./src/db/init')
const tasksRouter = require('./src/routes/tasks')

// Initialize app
const app = express()
const ORIGIN = process.env.ORIGIN || '*'
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())
app.use(express.json())
app.use(cors({ origin: ORIGIN }))

// API routes
app.use('/api/v1/tasks', tasksRouter)

// Error handler
app.use((err, req, res, next) => {
  console.error(err)
  const status = err.status || 500
  res.status(status).json({ error: err.message || 'Server error' })
})

// Initialize and start
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Database init failed:', err)
    process.exit(1)
  })

