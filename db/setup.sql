-- Create tables
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS jokes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER,
  setup TEXT,
  delivery TEXT,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Insert categories
INSERT INTO categories (name) VALUES ('funnyJoke');
INSERT INTO categories (name) VALUES ('lameJoke');

-- Insert jokes for funnyJoke
INSERT INTO jokes (category_id, setup, delivery) VALUES
((SELECT id FROM categories WHERE name = 'funnyJoke'), 'Why did the student eat his homework?', 'Because the teacher told him it was a piece of cake!'),
((SELECT id FROM categories WHERE name = 'funnyJoke'), 'What kind of tree fits in your hand?', 'A palm tree'),
((SELECT id FROM categories WHERE name = 'funnyJoke'), 'What is worse than raining cats and dogs?', 'Hailing taxis');

-- Insert jokes for lameJoke
INSERT INTO jokes (category_id, setup, delivery) VALUES
((SELECT id FROM categories WHERE name = 'lameJoke'), 'Which bear is the most condescending?', 'Pan-DUH'),
((SELECT id FROM categories WHERE name = 'lameJoke'), 'What would the Terminator be called in his retirement?', 'The Exterminator');