'use strict';

const output = document.getElementById("output");

//GET FUNCTION
function getRecipes() {
    axios.get("http://localhost:8080/getRecipes")
        .then(res => {
            output.innerHTML = "";
            const recipes = res.data;

            recipes.forEach(recipe => {
                const newRecipe = renderRecipe(recipe);
                console.log("New recipe: ", newRecipe);
                output.appendChild(newRecipe);
            });
        }).catch(err => console.error(err));
}


//RENDER RECIPES FUNCTION
function renderRecipe(recipe) {
    const newRow = document.createElement("tr");
    output.appendChild(newRow);

    const recipeName = document.createElement("td");
    recipeName.innerText = recipe.name;

    const recipeCalories = document.createElement("td");
    recipeCalories.innerText = recipe.calories;

    const recipePrepTime = document.createElement("td");
    recipePrepTime.innerText = recipe.prepTime;

    const recipeServingSize = document.createElement("td");
    recipeServingSize.innerText = recipe.servingSize;
    
    const deleteButton = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.addEventListener('click', function () {
    deleteRecipe(recipe.id);
    });
    deleteButton.appendChild(deleteBtn);

    newRow.appendChild(recipeName);
    newRow.appendChild(recipeCalories);
    newRow.appendChild(recipePrepTime);
    newRow.appendChild(recipeServingSize);
    newRow.appendChild(deleteButton);
    return newRow;
}


//DELETE FUNCTION
function deleteRecipe(id) {
    axios.delete("http://localhost:8080/removeRecipe/" + id)
        .then(() => getRecipes())
        .catch(err => console.error(err));
}

document.getElementById("recipeForm").addEventListener('submit', function (event) {
    event.preventDefault();

    console.log("this: ", this);
    console.log("this.name:", this.name);
    console.log("this.calories:", this.calories);
    console.log("this.prepTime:", this.prepTime);
    console.log("this.servingSize:", this.servingSize);

    const data = {
        name: this.name.value,
        calories: this.calories.value,
        prepTime: this.prepTime.value,
        servingSize: this.servingSize.value
    };

    axios.post("http://localhost:8080/createRecipe", data, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(() => {
        this.reset();
        getRecipes();
    })
        .catch(err => console.error(err));

});

    getRecipes();
