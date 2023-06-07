const express = require('express');
const fs = require(`fs`);
const path = require('path');

const app = express();
const port = 3000;

const pizzas = JSON.parse(fs.readFileSync('./data/pizzas.json', 'utf8'));
const allergens = JSON.parse(fs.readFileSync('./data/allergens.json', 'utf8'));

app.use(express.static(path.join(__dirname, '../frontend')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

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

app.get('/api/pizza/allergens', (req, res) => {
  console.log('GET at /api/pizza/allergens');
  let pizzasWithAllergens = pizzas.map((pizza) => {
    let allergensForThisPizza = allergens.filter((allergen) =>
      pizza.allergens.includes(allergen.id)
    );
    return { ...pizza, allergens: allergensForThisPizza };
  });
  res.json(pizzasWithAllergens);
});

app.listen(port, () => {
  console.log(`Server at http://localhost:${port}`);
});
