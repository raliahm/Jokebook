const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/jokebook.db');


module.exports = { getCategories: (cb) => {
  db.all("SELECT name FROM categories", [], (err, rows) => {
    if (err) return cb(err);
    const names = rows.map(row => row.name);
    cb(null, names);
  });
},   getJokesByCategory: (category, limit, cb) => {
  const baseQuery = `
    SELECT jokes.setup, jokes.delivery 
    FROM jokes
    JOIN categories ON jokes.category_id = categories.id
    WHERE categories.name = ?
  `;
  const query = limit ? baseQuery + ' LIMIT ?' : baseQuery;
  const params = limit ? [category, limit] : [category];

  db.all(query, params, (err, rows) => {
    if (err) return cb(err);
    if (rows.length === 0) return cb(null, { error: "No jokes found or invalid category." });
    cb(null, rows);
  });
},
  getJokesByCategory: (category, limit, cb) => {
    const baseQuery = `
      SELECT jokes.setup, jokes.delivery 
      FROM jokes
      JOIN categories ON jokes.category_id = categories.id
      WHERE categories.name = ?
    `;
    const query = limit ? baseQuery + ' LIMIT ?' : baseQuery;
    const params = limit ? [category, limit] : [category];
  
    // Execute the query to get jokes based on the category
    db.all(query, params, (err, rows) => {
      if (err) {
        console.log('Error getting jokes by category:', err); // Debugging log
        return cb(err);
      }
  
      // If no rows are returned, return an error object
      if (rows.length === 0) {
        console.log('No jokes found or invalid category'); // Debugging log
        return cb(null, { error: "No jokes found or invalid category." });
      }
  
      // Return the list of jokes if found
      console.log('Jokes by category:', rows); // Debugging log
      cb(null, rows);
    });
  }
  ,
  getRandomJoke: (cb) => {
    const sql = `
      SELECT setup, delivery
      FROM jokes
      ORDER BY RANDOM()
      LIMIT 1
    `;
    db.get(sql, [], (err, row) => {
      if (err) {
        console.log('Error getting random joke:', err);
        return cb(err);
      }
      console.log('Random joke:', row); // Add this line for debugging
      cb(null, row);
    });
  },
  
  addJoke: (category, setup, delivery, cb) => {
    db.serialize(() => {
      // Step 1: Ensure category exists
      db.run("INSERT OR IGNORE INTO categories (name) VALUES (?)", [category], (err) => {
        if (err) return cb(err);

        // Step 2: Get category ID
        db.get("SELECT id FROM categories WHERE name = ?", [category], (err, row) => {
          if (err || !row) return cb(err || new Error("Category not found"));
          const categoryId = row.id;

          // Step 3: Insert the joke
          db.run(
            "INSERT INTO jokes (category_id, setup, delivery) VALUES (?, ?, ?)",
            [categoryId, setup, delivery],
            function (err) {
              if (err) return cb(err);

              // Step 4: Return all jokes from that category
              db.all(
                "SELECT setup, delivery FROM jokes WHERE category_id = ?",
                [categoryId],
                (err, rows) => {
                  if (err) return cb(err);
                  cb(null, rows);
                }
              );
            }
          );
        });
      });
    });
  }
};
