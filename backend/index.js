const express = require('express');
const cors = require('cors');
const  githubRoutes = require('./github');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.send('Hello World!').status(200);
})
app.use('/github', githubRoutes);

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
