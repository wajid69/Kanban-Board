// SQL to initialize database tables
const pool = require('./connection')

// Create tasks table if not exists
async function initializeDatabase() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'done')),
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    await pool.query(createTableQuery)
    console.log('Database initialized - tasks table ready')
  } catch (err) {
    console.error('Database initialization error:', err.message)
    throw err
  }
}

module.exports = { initializeDatabase }
