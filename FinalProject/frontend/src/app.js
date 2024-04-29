const express = require('express');

const app = express();
const PORT = 80; //process.env.PORT;

// Designate the static folder as serving static resources
app.use(express.static(__dirname + '/static'));

const html_dir = __dirname + '/static/';

app.get('/', (req, res) => {
  res.sendFile(`${html_dir}dashboard.html`);
});

app.get('/login', (req, res) => {
  res.sendFile(`${html_dir}login.html`);
});

app.get('/addRecipe', (req, res) => {
  res.sendFile(`${html_dir}addRecipe.html`);
});

app.get('/profile', (req, res) => {
  res.sendFile(`${html_dir}profile.html`);
});

app.get('/offline', (req, res) => {
  res.sendFile(`${html_dir}offline.html`);
});

app.get('/registration', (req, res) => {
  res.sendFile(`${html_dir}registration.html`);
});

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));