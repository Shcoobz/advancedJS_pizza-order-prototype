const express = require('express');
const fs = require(`fs`);
const path = require('path');
const pizzaListPath = './data/pizzas.json';
const allergensListPath = './data/allergens.json';
const ordersListPath = './data/orders.json';
const { addAllergensToPizzas } = require('./utility');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../frontend/public')));

let pizzas, allergens, orders;

/**
 * Reads the pizza list JSON file and stores the data in the 'pizzas' variable.
 * @param {Error} err - The error object, if an error occurred while reading the file.
 * @param {string} data - The content of the pizza list JSON file.
 */
fs.readFile(pizzaListPath, 'utf8', (err, data) => {
  console.log('\nreading Pizza List');

  if (err) {
    console.error('Error reading file:', err);
    return res.status(500).send(err);
  }
  pizzas = JSON.parse(data);
});

/**
 * Reads the allergens list JSON file and stores the data in the 'allergens' variable.
 * @param {Error} err - The error object, if an error occurred while reading the file.
 * @param {string} data - The content of the allergens list JSON file.
 */
fs.readFile(allergensListPath, 'utf8', (err, data) => {
  console.log('\nreading Allergens List');

  if (err) {
    console.error('Error reading file:', err);
    return res.status(500).send(err);
  }
  allergens = JSON.parse(data);
});

/**
 * Reads the orders list JSON file and stores the data in the 'orders' variable.
 * @param {Error} err - The error object, if an error occurred while reading the file.
 * @param {string} data - The content of the orders list JSON file.
 */
fs.readFile(ordersListPath, 'utf8', (err, data) => {
  console.log('\nReading Orders List');

  if (err) {
    console.error('Error reading file:', err);
    return res.status(500).send(err);
  }
  orders = JSON.parse(data);
});

/**
 * Handles GET request for the '/api/pizza' endpoint.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.get('/api/pizza', (req, res) => {
  console.log('GET at /api/pizza');

  res.json(pizzas);
});

/**
 * Handles GET request for the '/api/allergen' endpoint.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.get('/api/allergen', (req, res) => {
  console.log('GET at /api/allergen');

  res.json(allergens);
});

/**
 * Handles GET request for the '/pizza/list' endpoint.
 * Adds allergen information to pizzas and responds with the updated list.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.get('/pizza/list', (req, res) => {
  console.log('GET at /pizza/list');

  const pizzasWithAllergens = addAllergensToPizzas(pizzas, allergens);
  res.json(pizzasWithAllergens);
});

/**
 * Handles GET request for the '/api/order' endpoint.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.get('/api/order', (req, res) => {
  console.log('GET at /api/order');
  console.log(req.body);
  res.json(orders);
});

/**
 * Handles POST request for the '/api/order' endpoint.
 * Adds a new order to the 'orders' array, saves it to the JSON file, and responds with the updated list of orders.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.post('/api/order', (req, res) => {
  console.log('POST at /api/order');
  console.log(req.body);
  console.log(orders);
  let date = new Date();
  let newOrderToPush = {
    id: uuidv4(),
    pizzas: [
      {
        id: req.body.pizzas[0].id,
        amount: req.body.pizzas[0].amount,
      },
    ],
    date: {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
    },
    customer: {
      name: req.body.customer.name,
      email: req.body.customer.email,
      adress: {
        city: req.body.customer.address.city,
        street: req.body.customer.address.street,
      },
    },
  };

  orders.push(newOrderToPush);

  try {
    fs.writeFileSync(ordersListPath, JSON.stringify(orders, null, 4));
  } catch (err) {
    console.error(err);
  }
  res.json(orders);
});

/**
 * Starts the server and listens on the specified port.
 */
app.listen(port, () => {
  console.log(`Server at http://localhost:${port}`);
});
