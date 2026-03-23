require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB();



app.use('/api/items', require('./routes/items'));
app.use('/api/admin', require('./routes/admin'));

app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
