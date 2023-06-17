const pizzaListDiv = document.getElementById("pizza");
const filterForm = document.getElementById("filterForm");
const allergenFilter = document.getElementById("allergenFilter");
const fixedPriceDecimal = 2;

let orders = [];

// fetching data
async function fetchData(url) {
	const response = await fetch(url);
	const data = await response.json();
	return data;
}

// task 2
// allergens
function createDefaultSelectOption() {
	let defaultOption = document.createElement("option");
	defaultOption.value = "";
	defaultOption.textContent = "Select Allergen";
	allergenFilter.appendChild(defaultOption);
}

function addAllergenOptions(allergens) {
	allergens.forEach((allergen) => {
		let option = document.createElement("option");
		option.value = allergen.id;
		option.textContent = allergen.name;
		allergenFilter.appendChild(option);
	});
}

async function fetchAndDisplayAllergens() {
	console.log("fetching Allergens data");

	const data = await fetchData("http://localhost:3000/api/allergen");

	createDefaultSelectOption();
	addAllergenOptions(data);
}

// pizzas
function filterPizzas(pizzas) {
	if (allergenFilter.value !== "") {
		return pizzas.filter((pizza) =>
			pizza.allergens.some(
				(allergen) => allergen.id == allergenFilter.value
			)
		);
	}
	return pizzas;
}

function createPizzaDiv(pizzas) {
	pizzaListDiv.innerHTML = "";

	pizzas.forEach((pizza) => {
		let pizzaDiv = document.createElement("div");

		pizzaDiv.innerHTML = `
      <h1>
        <b>${pizza.name}</b>
        <span class="w3-right w3-tag w3-dark-grey w3-round">${pizza.price.toFixed(
			fixedPriceDecimal
		)}</span>
      </h1>
      <p id="description" class="w3-text-grey">${pizza.description}</p>
      <div id="ingredients" class="w3-text-grey">Made with love and ${pizza.ingredients.join(
			", "
		)}</div>
      <div id="allergens" class="w3-text-grey">Allergens: ${pizza.allergens
			.map((allergen) => allergen.name)
			.join(", ")}</div>
        <label for="amount${pizza.id}">Amount:</label>
      <input id="amount${pizza.id}" type="number" min="1">
      <button onclick="addToOrder(${pizza.id})">Add</button>
      <hr />
    `;
		pizzaListDiv.appendChild(pizzaDiv);
	});
}

async function fetchAndDisplayPizzas() {
	console.log("fetching Pizza data");

	let pizzas = await fetchData("http://localhost:3000/pizza/list");

	pizzas = filterPizzas(pizzas);
	createPizzaDiv(pizzas);
}

// task 4
// orders

// functions
function addToOrder(pizzaId) {
	const minimumOrderAmount = 1;
	const amountInput = document.getElementById(`amount${pizzaId}`);
	const amount = Number(amountInput.value);

	if (isNaN(amount) || amount < minimumOrderAmount) {
		alert("Invalid amount");
		return;
	}

	let existingPizzaOrder = orders.find(
		(pizzaOrder) => pizzaOrder.id === pizzaId
	);
	if (existingPizzaOrder) {
		existingPizzaOrder.amount += amount;
	} else {
		orders.push({ id: pizzaId, amount });
	}

	amountInput.value = "";
	displayOrderForm();
}

function createDecreaseBtn(pizzaOrder, pizzaLine) {
	const decreaseButton = document.createElement("button");
	decreaseButton.classList.add("decrease-Btn");
	decreaseButton.textContent = "-";
	decreaseButton.addEventListener("click", () => {
		if (pizzaOrder.amount > 0) {
			pizzaOrder.amount--;
		}
		displayOrderForm();
	});
	pizzaLine.appendChild(decreaseButton);
}

function createIncreaseBtn(pizzaOrder, pizzaLine) {
	const increaseButton = document.createElement("button");
	increaseButton.classList.add("increase-Btn");
	increaseButton.textContent = "+";
	increaseButton.addEventListener("click", () => {
		pizzaOrder.amount++;
		displayOrderForm();
	});
	pizzaLine.appendChild(increaseButton);
}

function createDeleteBtn(orders, pizzaLine, index) {
	const deleteButton = document.createElement("button");
	deleteButton.classList.add("delete-Btn");
	deleteButton.textContent = "Del";
	deleteButton.addEventListener("click", () => {
		orders.splice(index, 1);
		displayOrderForm();
	});
	pizzaLine.appendChild(deleteButton);
}

function calculatePizzaPrice(pizzaOrder, pizzas) {
	const pizza = pizzas.find((pizza) => pizza.id === pizzaOrder.id);
	return parseFloat(
		(pizza.price * pizzaOrder.amount).toFixed(fixedPriceDecimal)
	);
}

function calculateOverallTotal(orders, pizzas) {
	const total = orders.reduce((acc, pizzaOrder) => {
		const pizzaPrice = calculatePizzaPrice(pizzaOrder, pizzas);
		return acc + pizzaPrice;
	}, 0);

	return parseFloat(total.toFixed(fixedPriceDecimal));
}

function createAndAppendPizzaText(pizzaLine, pizzaName, pizzaAmount) {
	const pizzaText = document.createElement("span");
	pizzaText.textContent = `${pizzaName}: ${pizzaAmount} `;
	pizzaLine.appendChild(pizzaText);
}

function createAndAppendTotalText(pizzaLine, totalPizzaPrice) {
	const totalText = document.createElement("p");
	totalText.textContent = `Total: ${totalPizzaPrice} potatoes`;
	pizzaLine.appendChild(totalText);
}

function createPizzaLineElement(pizzaOrder, pizzas, index) {
	const pizzaLine = document.createElement("div");
	pizzaLine.classList.add("pizza-border");

	const pizza = pizzas.find((pizza) => pizza.id === pizzaOrder.id);

	createAndAppendPizzaText(pizzaLine, pizza.name, pizzaOrder.amount);
	createDecreaseBtn(pizzaOrder, pizzaLine);
	createIncreaseBtn(pizzaOrder, pizzaLine);
	createDeleteBtn(orders, pizzaLine, index);

	return pizzaLine;
}

function appendOverallTotal(orderSummaryDiv, overallTotal) {
	const totalLine = document.createElement("p");
	totalLine.textContent = `Overall total: ${overallTotal} potatoes`;
	orderSummaryDiv.appendChild(totalLine);
}

function handleOrderResponse(response) {
	if (response.ok) {
		orders = [];
		alert("Order placed successfully");
	} else {
		alert("Failed to place order");
	}
}

function getOrderDetailsFromForm() {
	const name = document.getElementById("name").value;
	const email = document.getElementById("email").value;
	const city = document.getElementById("city").value;
	const street = document.getElementById("street").value;

	if (!name || !email || !city || !street) {
		alert("Please fill in all fields");
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

// async functions
async function fetchPizzas() {
	console.log("fetching Pizza Data");

	const pizzas = await fetchData("http://localhost:3000/pizza/list");
	return pizzas;
}

async function displayOrderForm() {
	const orderFormDiv = document.getElementById("orderForm");
	const orderSummaryDiv = document.getElementById("orderSummary");

	if (orders.length > 0) {
		orderFormDiv.style.display = "block";
		let pizzas = await fetchPizzas();
		orderSummaryDiv.innerHTML = "";
		let overallTotal = 0;

		orders.forEach((pizzaOrder, index) => {
			const totalPizzaPrice = calculatePizzaPrice(pizzaOrder, pizzas);
			const pizzaLine = createPizzaLineElement(pizzaOrder, pizzas, index);

			createAndAppendTotalText(pizzaLine, totalPizzaPrice);
			overallTotal += totalPizzaPrice;

			orderSummaryDiv.appendChild(pizzaLine);
		});

		appendOverallTotal(orderSummaryDiv, overallTotal);
	} else {
		orderFormDiv.style.display = "none";
	}
}

async function submitOrderDetails(orderDetails) {
	console.log("fetching Order Data");

	let response = await fetch("http://localhost:3000/api/order", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(orderDetails),
	});

	return response;
}

async function submitOrder() {
	let orderDetails = getOrderDetailsFromForm();

	if (!orderDetails) {
		return;
	}

	let response = await submitOrderDetails(orderDetails);
	handleOrderResponse(response);
	displayOrderForm();
}

// main
async function main() {
	await fetchAndDisplayAllergens();
	filterForm.onchange = fetchAndDisplayPizzas;
	await fetchAndDisplayPizzas();
}

main();
