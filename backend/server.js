const express = require('express');
const fs = require(`fs`);
const path = require('path');
const pizzaListPath = './data/pizzas.json';
const allergensListPath = './data/allergens.json';
const app = express();
const port = 3000;

let pizzas, allergens;

app.use(express.static(path.join(__dirname, '../frontend')));

// app.get('/', (req, res) => {
//   const jsonData = fs.readFileSync('pizzas.json', 'utf8');
//   const data = JSON.parse(jsonData);

//   res.send(data);
//   res.render(index);
// });

fs.readFile(pizzaListPath, 'utf8', (err, data) => {
  console.log('\nreading Pizza List');

  if (err) {
    console.error('Error reading file:', err);
    return res.status(500).send(err);
  }
  pizzas = JSON.parse(data);
});

fs.readFile(allergensListPath, 'utf8', (err, data) => {
  console.log('\nreading Allergenes List');

  if (err) {
    console.error('Error reading file:', err);
    return res.status(500).send(err);
  }
  allergens = JSON.parse(data);
});

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

  // find allergens
  const getAllergensForPizza = (pizza) => {
    const pizzaAllergens = allergens.filter((allergen) =>
      pizza.allergens.includes(allergen.id)
    );

    return pizzaAllergens;
  };

  // add allergens to pizza
  const pizzasWithAllergens = pizzas.map((pizza) => {
    const allergenForThisPizza = getAllergensForPizza(pizza);
    return { ...pizza, allergens: allergenForThisPizza };
  });

  res.json(pizzasWithAllergens);
});

app.listen(port, () => {
  console.log(`Server at http://localhost:${port}`);
});
