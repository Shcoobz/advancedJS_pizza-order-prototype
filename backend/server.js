const express = require('express');
const fs = require(`fs`);
const path = require('path');
const pizzaListPath = './data/pizzas.json';
const allergensListPath = './data/allergens.json';
const ordersListPath = './data/orders.json';
const app = express();
const port = 3000;

let pizzas, allergens, orders;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../frontend/public')));

// reading of files
fs.readFile(pizzaListPath, 'utf8', (err, data) => {
  console.log('\nreading Pizza List');

  if (err) {
    console.error('Error reading file:', err);
    return res.status(500).send(err);
  }
  pizzas = JSON.parse(data);
});

fs.readFile(allergensListPath, 'utf8', (err, data) => {
  console.log('\nreading Allergens List');

  if (err) {
    console.error('Error reading file:', err);
    return res.status(500).send(err);
  }
  allergens = JSON.parse(data);
});

fs.readFile(ordersListPath, 'utf8', (err, data) => {
  console.log('\nreading Orders List');

  if (err) {
    console.error('Error reading file:', err);
    return res.status(500).send(err);
  }
  orders = JSON.parse(data);
});

// task 1
app.get('/api/pizza', (req, res) => {
  console.log('GET at /api/pizza');

  res.json(pizzas);
});

app.get('/api/allergen', (req, res) => {
  console.log('GET at /api/allergen');

  res.json(allergens);
});

// task 2
function getAllergensForPizza(pizza, allergens) {
  const pizzaAllergens = allergens.filter((allergen) =>
    pizza.allergens.includes(allergen.id)
  );

  return pizzaAllergens;
}

function addAllergensToPizzas(pizzas, allergens) {
  const pizzasWithAllergens = pizzas.map(function (pizza) {
    const allergenForThisPizza = getAllergensForPizza(pizza, allergens);
    return { ...pizza, allergens: allergenForThisPizza };
  });

  return pizzasWithAllergens;
}

app.get('/pizza/list', (req, res) => {
  console.log('GET at /pizza/list');

  const pizzasWithAllergens = addAllergensToPizzas(pizzas, allergens);
  res.json(pizzasWithAllergens);
});

// task 3
app.get('/api/order', (req, res) => {
  console.log('GET at /api/order');
  console.log(req.body);
  res.json(orders);
});

app.post('/api/order', (req, res) => {
  console.log('POST at /api/order');
  //orders = req.body
  orders.push(new Date());

  try {
    fs.writeFileSync(ordersListPath, JSON.stringify(orders, null, 4));
  } catch (err) {
    console.error(err);
  }
  res.json(orders);
});

// server location
app.listen(port, () => {
  console.log(`\nServer at http://localhost:${port}`);
});
