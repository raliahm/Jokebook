const JokeModel = require('../models/jokeModel');

// Get all joke categories
exports.getCategories = (req, res) => {
  JokeModel.getCategories((err, categories) => {
    if (err) return res.status(500).json({ message: 'Error retrieving categories', error: err });
    res.status(200).json(categories);
  });
};

// Get jokes by category
exports.getJokesByCategory = (req, res) => {
    const { category } = req.params;
    const limit = req.query.limit || null;
  
    // Call model method to fetch jokes by category
    JokeModel.getJokesByCategory(category, limit, (err, jokes) => {
      if (err) {
        return res.status(500).json({ message: 'Error retrieving jokes by category', error: err });
      }
  
      // If no jokes are found or an invalid category is given
      if (jokes.error) {
        return res.status(404).json(jokes);
      }
  
      // Return the list of jokes in the given category
      res.status(200).json(jokes);
    });
  };

// Get a random joke
exports.getRandomJoke = (req, res) => {
    JokeModel.getRandomJoke((err, joke) => {
      if (err) return res.status(500).json({ message: 'Error retrieving random joke', error: err });
      if (!joke) return res.status(404).json({ message: 'No random joke found' }); // Check for null joke
      res.status(200).json(joke);
    });
  };
  

// Add a new joke
// Add a joke
exports.addJoke = (req, res) => {
    // Extract data from the request body
    const { category, setup, delivery } = req.body;
  
    // Check if all required fields are provided
    if (!category || !setup || !delivery) {
      return res.status(400).json({ message: 'Missing required fields: category, setup, delivery' });
    }
  
    // Call the model method to add the joke
    JokeModel.addJoke(category, setup, delivery, (err, jokes) => {
      if (err) {
        return res.status(500).json({ message: 'Error adding joke', error: err });
      }
  
      // Return the list of jokes from that category
      res.status(201).json({ message: 'Joke added successfully', jokes });
    });
  };
  