const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.error('Error connecting to database:', err);
  });

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
