const express = require('express');
const app = express();
const jokeRoutes = require('./routes/jokeRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use('/jokebook', jokeRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));