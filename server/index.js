require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();


app.use('/api/items', require('./routes/items'));

app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
