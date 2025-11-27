// PostgreSQL connection using pg driver
const { Pool } = require('pg')

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

// Test connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
})

// Export pool for queries
module.exports = pool
