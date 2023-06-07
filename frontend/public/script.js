window.onload = function () {
  let pizzaListDiv = document.getElementById('pizzaList');
  let filterForm = document.getElementById('filterForm');
  let allergenFilter = document.getElementById('allergenFilter');

  // Fetch allergens and fill in the filter options
  fetch('http://localhost:3000/api/allergen')
    .then((response) => response.json())
    .then((data) => {
      let defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Select allergen';
      allergenFilter.appendChild(defaultOption);

      data.forEach((allergen) => {
        let option = document.createElement('option');
        option.value = allergen.id;
        option.textContent = allergen.name;
        allergenFilter.appendChild(option);
      });
    });

  // React to changes in the allergen filter
  filterForm.onchange = function () {
    fetchPizzas();
  };

  // Function to fetch pizzas and fill in the pizza list
  function fetchPizzas() {
    fetch('http://localhost:3000/api/pizza/allergens')
      .then((response) => response.json())
      .then((data) => {
        console.log('initial data length:', data.length);
        let filteredData = data;

        if (allergenFilter.value !== '') {
          filteredData = data.filter((pizza) =>
            pizza.allergens.some(
              (allergen) => allergen.id == allergenFilter.value
            )
          );
        }

        pizzaListDiv.innerHTML = ''; // clear the pizza list

        filteredData.forEach((pizza) => {
          let pizzaDiv = document.createElement('div');
          pizzaDiv.innerHTML = `
              <h1>
                <b>${pizza.name}</b>
                <span class="w3-right w3-tag w3-dark-grey w3-round">$${pizza.price.toFixed(
                  2
                )}</span>
              </h1>
              <p id="description" class="w3-text-grey">
                ${pizza.description}
              </p>
              <div id="ingredients" class="w3-text-grey">
                Ingredients: ${pizza.ingredients.join(', ')}
              </div>
              <div id="allergens" class="w3-text-grey">
                Allergens: ${pizza.allergens
                  .map((allergen) => allergen.name)
                  .join(', ')}
              </div>
              <hr />
            `;
          pizzaListDiv.appendChild(pizzaDiv);
        });
      });
  }

  // Fetch pizzas initially
  fetchPizzas();
};
