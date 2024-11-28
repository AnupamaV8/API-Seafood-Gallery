const searchForm = document.querySelector("#search");
const dishList = document.querySelector("#dish-list");
const container = document.querySelector("#container");
const input = document.querySelector("#input");
const nextButton = document.querySelector("#next-button");
const prevButton = document.querySelector("#prev-button");
const detailsView = document.querySelector("#details-view");
const backToGallery = document.querySelector("#back-to-gallery");
const popup = document.querySelector("#input-popup"); // Consistent use of popup
const closePopupButton = document.querySelector("#close-popup");
let currentPage = 0;
const itemsPerPage = 6;
let allDishes = [];
let filteredDishes = [];
const apiEndpoint =
  "https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood";

async function getDishes(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    allDishes = data.meals;
  } catch (error) {
    console.error(`Error fetching dishes: ${error}`);
  }
}
function displayPaginatedDishes() {
  const start = currentPage * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedDishes = filteredDishes.slice(start, end);
  dishList.innerHTML = "";
  paginatedDishes.forEach((dish) => {
    const dishCard = document.createElement("div");
    dishCard.className = "dish-card";
    dishCard.innerHTML = `
      <img src="${dish.strMealThumb}" alt="${dish.strMeal}">
      <h3>${dish.strMeal}</h3>
    `;
    dishCard.addEventListener("click", () => showDishDetails(dish));
    dishList.appendChild(dishCard);
  });

  prevButton.disabled = currentPage === 0;
  nextButton.style.display = end >= filteredDishes.length ? "none" : "block";
}

function showDishDetails(dish) {
  detailsView.querySelector("#detail-image").src = dish.strMealThumb;
  detailsView.querySelector("#detail-title").textContent = dish.strMeal;
  detailsView.querySelector("#detail-id").textContent = `ID: ${dish.idMeal}`;
  container.style.display = "none";
  detailsView.style.display = "block";
}

backToGallery.addEventListener("click", () => {
  detailsView.style.display = "none";
  container.style.display = "block";
});

function showPopup() {
  popup.style.display = "flex";
}
closePopupButton.addEventListener("click", () => {
  popup.style.display = "none";
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchTerm = input.value.trim().toLowerCase();

  if (!searchTerm) {
    showPopup();
    return;
  }
  filteredDishes = allDishes.filter((dish) =>
    dish.strMeal.toLowerCase().includes(searchTerm)
  );
  if (filteredDishes.length === 0) {
    alert("No dishes match your search.");
    return;
  }
  currentPage = 0;
  container.style.display = "block";
  displayPaginatedDishes();
});

nextButton.addEventListener("click", () => {
  currentPage++;
  // console.log("Next page clicked. Current page:", currentPage);
  displayPaginatedDishes();
});

prevButton.addEventListener("click", () => {
  currentPage--;
  //console.log("Previous page clicked. Current page:", currentPage);
  displayPaginatedDishes();
});

getDishes(apiEndpoint);
