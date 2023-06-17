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

module.exports = {
	addAllergensToPizzas,
};
