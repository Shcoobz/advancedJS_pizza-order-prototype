const express = require('express');
const fs = require(`fs`);

const app = express();
const port = 3000;

const pizzas = JSON.parse(fs.readFileSync('pizzas.json', 'utf8'));
const allergens = JSON.parse(fs.readFileSync('allergens.json', 'utf8'));

// app.get('/', (req, res) => {
//   const jsonData = fs.readFileSync('pizzas.json', 'utf8');
//   const data = JSON.parse(jsonData);

//   res.send(data);
//   res.render(index);
// });

app.get('/api/pizza', (req, res) => {
  console.log('GET at /api/pizza');
  res.json(pizzas);
});

app.get('/api/allergen', (req, res) => {
  console.log('GET at /api/allergen');
  res.json(allergens);
});

app.listen(port, () => {
  console.log(`Server at http://localhost:${port}`);
});
