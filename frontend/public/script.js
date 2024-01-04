const pizzaListDiv = document.getElementById('pizza');
const filterForm = document.getElementById('filterForm');
const allergenFilter = document.getElementById('allergenFilter');
const fixedPriceDecimal = 2;

let orders = [];

/**
 * Function to fetch data from the specified URL.
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<any>} A Promise that resolves to the fetched data.
 */
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

/**
 * Function to create a default select option for allergens.
 */
function createDefaultSelectOption() {
  let defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Select Allergen';
  allergenFilter.appendChild(defaultOption);
}

/**
 * Function to add allergen options to the select element.
 * @param {Array} allergens - An array of allergen objects.
 */
function addAllergenOptions(allergens) {
  allergens.forEach((allergen) => {
    let option = document.createElement('option');
    option.value = allergen.id;
    option.textContent = allergen.name;
    allergenFilter.appendChild(option);
  });
}

/**
 * Function to fetch and display allergen data.
 */
async function fetchAndDisplayAllergens() {
  console.log('fetching Allergens data');

  const data = await fetchData('http://localhost:3000/api/allergen');

  createDefaultSelectOption();
  addAllergenOptions(data);
}

/**
 * Function to filter pizzas based on selected allergen.
 * @param {Array} pizzas - An array of pizza objects.
 * @returns {Array} An array of filtered pizza objects.
 */
function filterPizzas(pizzas) {
  if (allergenFilter.value !== '') {
    return pizzas.filter((pizza) =>
      pizza.allergens.some((allergen) => allergen.id == allergenFilter.value)
    );
  }
  return pizzas;
}

/**
 * Function to create pizza div elements and add them to the DOM.
 * @param {Array} pizzas - An array of pizza objects to display.
 */
function createPizzaDiv(pizzas) {
  pizzaListDiv.innerHTML = '';

  pizzas.forEach((pizza) => {
    let pizzaDiv = document.createElement('div');

    pizzaDiv.innerHTML = `
      <h1>
        <b>${pizza.name}</b>
        <span class="w3-right w3-tag w3-dark-grey w3-round">${pizza.price.toFixed(
          fixedPriceDecimal
        )}</span>
      </h1>
      <p id="description" class="w3-text-grey">${pizza.description}</p>
      <div id="ingredients" class="w3-text-grey">Made with love and ${pizza.ingredients.join(
        ', '
      )}</div>
      <div id="allergens" class="w3-text-grey">Allergens: ${pizza.allergens
        .map((allergen) => allergen.name)
        .join(', ')}</div>
        <label for="amount${pizza.id}">Amount:</label>
      <input id="amount${pizza.id}" type="number" min="1">
      <button onclick="addToOrder(${pizza.id})">Add</button>
      <hr />
    `;
    pizzaListDiv.appendChild(pizzaDiv);
  });
}

async function fetchAndDisplayPizzas() {
  console.log('fetching Pizza data');

  let pizzas = await fetchData('http://localhost:3000/pizza/list');

  pizzas = filterPizzas(pizzas);
  createPizzaDiv(pizzas);
}

/**
 * Function to add a pizza to the order.
 * @param {number} pizzaId - The ID of the pizza to add to the order.
 */
function addToOrder(pizzaId) {
  const minimumOrderAmount = 1;
  const amountInput = document.getElementById(`amount${pizzaId}`);
  const amount = Number(amountInput.value);

  if (isNaN(amount) || amount < minimumOrderAmount) {
    alert('Invalid amount');
    return;
  }

  let existingPizzaOrder = orders.find((pizzaOrder) => pizzaOrder.id === pizzaId);
  if (existingPizzaOrder) {
    existingPizzaOrder.amount += amount;
  } else {
    orders.push({ id: pizzaId, amount });
  }

  amountInput.value = '';
  displayOrderForm();
}

/**
 * Function to create a decrease button for a pizza in the order.
 * @param {Object} pizzaOrder - The pizza order object.
 * @param {Element} pizzaLine - The pizza line element to append the button to.
 */
function createDecreaseBtn(pizzaOrder, pizzaLine) {
  const decreaseButton = document.createElement('button');
  decreaseButton.classList.add('decrease-Btn');
  decreaseButton.textContent = '-';
  decreaseButton.addEventListener('click', () => {
    if (pizzaOrder.amount > 0) {
      pizzaOrder.amount--;
    }
    displayOrderForm();
  });
  pizzaLine.appendChild(decreaseButton);
}

/**
 * Function to create an increase button for a pizza in the order.
 * @param {Object} pizzaOrder - The pizza order object.
 * @param {Element} pizzaLine - The pizza line element to append the button to.
 */
function createIncreaseBtn(pizzaOrder, pizzaLine) {
  const increaseButton = document.createElement('button');
  increaseButton.classList.add('increase-Btn');
  increaseButton.textContent = '+';
  increaseButton.addEventListener('click', () => {
    pizzaOrder.amount++;
    displayOrderForm();
  });
  pizzaLine.appendChild(increaseButton);
}

/**
 * Function to create a delete button for a pizza in the order.
 * @param {Array} orders - An array of pizza order objects.
 * @param {Element} pizzaLine - The pizza line element to append the button to.
 * @param {number} index - The index of the pizza order in the array.
 */
function createDeleteBtn(orders, pizzaLine, index) {
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-Btn');
  deleteButton.textContent = 'Del';
  deleteButton.addEventListener('click', () => {
    orders.splice(index, 1);
    displayOrderForm();
  });
  pizzaLine.appendChild(deleteButton);
}

/**
 * Function to calculate the price of a pizza in the order.
 * @param {Object} pizzaOrder - The pizza order object.
 * @param {Array} pizzas - An array of pizza objects.
 * @returns {number} The calculated pizza price.
 */
function calculatePizzaPrice(pizzaOrder, pizzas) {
  const pizza = pizzas.find((pizza) => pizza.id === pizzaOrder.id);
  console.log(pizza);
  return parseFloat((pizza.price * pizzaOrder.amount).toFixed(fixedPriceDecimal));
}

/**
 * Function to calculate the overall total price of the order.
 * @param {Array} orders - An array of pizza order objects.
 * @param {Array} pizzas - An array of pizza objects.
 * @returns {number} The calculated overall total price.
 */
function calculateOverallTotal(orders, pizzas) {
  const total = orders.reduce((acc, pizzaOrder) => {
    const pizzaPrice = calculatePizzaPrice(pizzaOrder, pizzas);
    return acc + pizzaPrice;
  }, 0);
  console.log(total);

  return parseFloat(total.toFixed(fixedPriceDecimal));
}

/**
 * Function to create and append pizza text to a pizza line element.
 * @param {Element} pizzaLine - The pizza line element to append the text to.
 * @param {string} pizzaName - The name of the pizza.
 * @param {number} pizzaAmount - The amount of the pizza in the order.
 */
function createAndAppendPizzaText(pizzaLine, pizzaName, pizzaAmount) {
  const pizzaText = document.createElement('span');
  pizzaText.textContent = `${pizzaName}: ${pizzaAmount} `;
  pizzaLine.appendChild(pizzaText);
}

/**
 * Function to create and append total text to a pizza line element.
 * @param {Element} pizzaLine - The pizza line element to append the text to.
 * @param {number} totalPizzaPrice - The total price of the pizza.
 */
function createAndAppendTotalText(pizzaLine, totalPizzaPrice) {
  const totalText = document.createElement('p');
  totalText.textContent = `Total: ${totalPizzaPrice} potatoes`;
  pizzaLine.appendChild(totalText);
}

/**
 * Function to create a pizza line element for a pizza in the order.
 * @param {Object} pizzaOrder - The pizza order object.
 * @param {Array} pizzas - An array of pizza objects.
 * @param {number} index - The index of the pizza order in the array.
 * @returns {Element} The created pizza line element.
 */
function createPizzaLineElement(pizzaOrder, pizzas, index) {
  const pizzaLine = document.createElement('div');
  pizzaLine.classList.add('pizza-border');

  const pizza = pizzas.find((pizza) => pizza.id === pizzaOrder.id);

  createAndAppendPizzaText(pizzaLine, pizza.name, pizzaOrder.amount);
  createDecreaseBtn(pizzaOrder, pizzaLine);
  createIncreaseBtn(pizzaOrder, pizzaLine);
  createDeleteBtn(orders, pizzaLine, index);

  return pizzaLine;
}

/**
 * Function to append the overall total to the order summary.
 * @param {Element} orderSummaryDiv - The order summary element.
 * @param {number} overallTotal - The overall total price.
 */
function appendOverallTotal(orderSummaryDiv, overallTotal) {
  const totalLine = document.createElement('p');
  totalLine.textContent = `Overall total: ${overallTotal} potatoes`;
  orderSummaryDiv.appendChild(totalLine);
}

/**
 * Function to handle the response after placing an order.
 * @param {Response} response - The response object.
 */
function handleOrderResponse(response) {
  if (response.ok) {
    orders = [];
    alert('Order placed successfully');
  } else {
    alert('Failed to place order');
  }
}

/**
 * Function to get order details from the order form.
 * @returns {Object|null} The order details object or null if fields are not filled.
 */
function getOrderDetailsFromForm() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const city = document.getElementById('city').value;
  const street = document.getElementById('street').value;

  if (!name || !email || !city || !street) {
    alert('Please fill in all fields');
    return null;
  }

  return {
    pizzas: orders,
    customer: {
      name,
      email,
      address: {
        street,
        city,
      },
    },
  };
}

/**
 * Function to fetch pizza data.
 * @returns {Promise<Array>} A Promise that resolves to an array of pizza objects.
 */
async function fetchPizzas() {
  console.log('fetching Pizza Data');

  const pizzas = await fetchData('http://localhost:3000/pizza/list');
  return pizzas;
}

/**
 * Function to display the order form and order summary.
 */
async function displayOrderForm() {
  const orderFormDiv = document.getElementById('orderForm');
  const orderSummaryDiv = document.getElementById('orderSummary');

  if (orders.length > 0) {
    orderFormDiv.style.display = 'block';
    let pizzas = await fetchPizzas();
    orderSummaryDiv.innerHTML = '';
    const totalOrderPrice = calculateOverallTotal(orders, pizzas);
    console.log(totalOrderPrice);
    orders.forEach((pizzaOrder, index) => {
      const totalPizzaPrice = calculatePizzaPrice(pizzaOrder, pizzas);

      const pizzaLine = createPizzaLineElement(pizzaOrder, pizzas, index);

      createAndAppendTotalText(pizzaLine, totalPizzaPrice);

      orderSummaryDiv.appendChild(pizzaLine);
    });

    appendOverallTotal(orderSummaryDiv, totalOrderPrice);
  } else {
    orderFormDiv.style.display = 'none';
  }
}

/**
 * Function to submit order details to the server.
 * @param {Object} orderDetails - The order details object.
 * @returns {Promise<Response>} A Promise that resolves to the server response.
 */
async function submitOrderDetails(orderDetails) {
  console.log('fetching Order Data');

  let response = await fetch('http://localhost:3000/api/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderDetails),
  });

  return response;
}

/**
 * Function to submit the order to the server.
 */
async function submitOrder() {
  let orderDetails = getOrderDetailsFromForm();

  if (!orderDetails) {
    return;
  }

  let response = await submitOrderDetails(orderDetails);
  handleOrderResponse(response);
  displayOrderForm();
}

/**
 * Main function to initialize the application.
 */
async function main() {
  await fetchAndDisplayAllergens();
  filterForm.onchange = fetchAndDisplayPizzas;
  await fetchAndDisplayPizzas();
}

main();
