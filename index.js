'use strict';

const output = document.getElementById("output");

let recipeId;

var recipeModal = new bootstrap.Modal(document.getElementById('recipeModal'), {
    keyboard: false
  })

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
    
    //UPDATE BUTTONS BRINGS UP THE RECIPE MODAL
    const updateButton = document.createElement("td");
    const updateBtn = document.createElement("button");
    updateBtn.innerText = "Update";
    updateBtn.addEventListener('click', function () {
        $("#recipeModal").modal('show');
        recipeId = recipe.id;
    });
    updateButton.appendChild(updateBtn);

    newRow.appendChild(recipeName);
    newRow.appendChild(recipeCalories);
    newRow.appendChild(recipePrepTime);
    newRow.appendChild(recipeServingSize);
    newRow.appendChild(deleteButton);
    newRow.appendChild(updateButton);
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

//FUNCTIONALITY OF THE UPDATE BUTTON IN THE RECIPE MODAL
document.getElementById("updateForm").addEventListener('submit', function (event) {
    event.preventDefault();

    console.log("this: ", this);
    console.log("this.name:", this.name);
    console.log("this.calories:", this.calories);
    console.log("this.prepTime:", this.prepTime);
    console.log("this.servingSize:", this.servingSize);

    const updatedData = {
        name: this.name.value,
        calories: this.calories.value,
        prepTime: this.prepTime.value,
        servingSize: this.servingSize.value
    }

    axios.put("http://localhost:8080/updateRecipe/" + recipeId, updatedData)
    .then(() => {
        this.reset();
        recipeModal.toggle();
        getRecipes();
    })
    .catch(err => console.error(err));
})

    getRecipes();
