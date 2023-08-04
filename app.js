const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
// require('dotenv').config();

// Copy the .env.example in the root into a .env file in this folder
const envFilePath = path.resolve(__dirname, `.env`);
const env = require("dotenv").config({ path: envFilePath });
if (env.error) {
  throw new Error(`Unable to load the .env file from ${envFilePath}. Please copy .env.example to ${envFilePath}`);
}

const connectionString = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_OPTIONS}`;
const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/book')

console.log(process.env.MONGODB_USER)

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/public', express.static(path.resolve(__dirname, "./images")));
app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);



module.exports = app;