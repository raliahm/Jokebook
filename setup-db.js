// setup-db.js
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// Path to your DB and SQL file
const dbPath = 'db/jokebook.db';
const sqlPath = 'db/setup.sql';

// Read the SQL file
const setupSQL = fs.readFileSync(sqlPath, 'utf-8');

// Connect to the database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Could not open database', err.message);
    return;
  }
  console.log('✅ Connected to jokebook.db');
});

// Execute the SQL commands
db.exec(setupSQL, (err) => {
  if (err) {
    console.error('❌ Error executing SQL file:', err.message);
  } else {
    console.log('✅ Database initialized successfully!');
  }
  db.close();
});
