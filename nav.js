
const searchForm = document.querySelector('form');
const searchResultDiv = document.querySelector('.search-result');
const container = document.querySelector('.container');
const searchBtn = document.querySelector('#search-btn');
const mealDetailsContent = document.querySelector('.meal-details-content')


let searchQuery = '';

searchResultDiv.addEventListener('click', getMealRecipe)
document.addEventListener('DOMContentLoaded', () => {
  const recipeCloseBtn = document.querySelector('.recipe-close-btn');
  recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
  });
});




searchForm.addEventListener('submit', (e) => {
  debugger
  e.preventDefault();
  searchQuery = e.target.querySelector('input').value;
  if (searchQuery === '') {
    console.log("Search query is empty.");
    searchResultDiv.innerHTML = "<p class='noResult'> Please Enter Some Dish 🍝</p>";
    return;
  }
  fetchAPI(searchQuery);
});

searchBtn.addEventListener("click", () => {
searchForm.dispatchEvent(new Event("submit"));
});


async function fetchAPI(searchQuery) {
  const baseUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=bd43fd17662a4e51b353ae0f0a92ee32&query=${searchQuery}&addRecipeInformation=true`
  

  const storedData = localStorage.getItem(searchQuery);
  
  
  if (storedData) {
    debugger
    generateHTML(JSON.parse(storedData).results);
    return;
  }

  try {
    const response = await fetch(baseUrl);
    const data = await response.json();
    

    if (data.results.length === 0) {
      console.log("No results found.");
      searchResultDiv.innerHTML = "<p class='noResult'> No recipe found for this search. Please try again!! </p>";
      return;
    }

    localStorage.setItem(searchQuery, JSON.stringify(data));
    console.log(JSON.parse(localStorage.getItem(searchQuery)));
    debugger
    generateHTML(data.results);
  } catch (error) {
    console.error(error);
  }
}




function generateHTML(results) {
  container.classList.remove("initial");
  let generatedHTML = "";  
  

  results.map((result) => {
    generatedHTML +=
    `
    <div class="item " data-id = "${result.id}">
        <img src="${result.image}" alt= "Biryani Picture">
        <div class="flex-container">
            <h1 class="title"> ${result.title }</h1>
            <p   class="item-data"> Time: ${result.readyInMinutes} mins</p>
            <a class="Btn"  >Try it</a>
        </div>
        
    </div>
    `

  });
  searchResultDiv.innerHTML = generatedHTML;
}

function getMealRecipe(e) {
   e.preventDefault();
   if (e.target.classList.contains("Btn")) {
  let recipeCard = e.target.parentElement.parentElement;
  let recipeId = recipeCard.dataset.id; 

  const storedData = localStorage.getItem(`recipe_${recipeId}`);

  if (storedData) {
    mealRecipeModal(JSON.parse(storedData));
  } else {
    fetch(
      `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=bd43fd17662a4e51b353ae0f0a92ee32&includeNutrition=false`
      )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        localStorage.setItem(`recipe_${recipeId}`, JSON.stringify(data)); // store data in local storage
        console.log(JSON.parse(localStorage.getItem(`recipe_${recipeId}`)));
        mealRecipeModal(JSON.parse(localStorage.getItem(`recipe_${recipeId}`)));
      });
  }
}
}




function mealRecipeModal(meal) {
  let html = `
    <h1 class="recipe-title">${meal.title}</h1>
    <div class="recipe-instruct">
      <h2 class="instruction">Ingredients:</h2>
      <div class="steps">
        ${meal.extendedIngredients.map((ingredient, index) => `<div>${index + 1}. ${ingredient.original}</div>`).join('')}
      </div>
      <div class="recipe-meal-img">
      <img src="${meal.image}" alt="">
    </div>
      <h2 class="instruction">Instructions:</h2>
      <div class="steps">${meal.instructions}</div>
      
    </div>
    
  `;
  mealDetailsContent.innerHTML = html;
  mealDetailsContent.parentElement.classList.add('showRecipe');
}






