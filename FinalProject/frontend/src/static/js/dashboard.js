import api from './API_Client_Mock.js';



let recipeList = document.querySelector(".recipeList");
let consumptionList = document.querySelector(".consumptionList");

//TODO Change to current user session
api.getCurrentUser().then(user => {
    localStorage.setItem("userId", user.user_id);
    api.getRecipebyId(localStorage.getItem("userId")).then(recipes => {
        localStorage.setItem("recipes", JSON.stringify(recipes));
        //Loop through all user recipes and add them to frontend
        for (let i = 0; i < recipes.length; i++) {
            addRecipe(recipes[i]);
        }
    });

    //Loop through all user meals and add them to frontend
    api.getDailyMeals(localStorage.getItem("userId")).then(meals => {
        localStorage.setItem("dailyMeals", JSON.stringify(meals));

        for (let i = 0; i < meals.length; i++) {
            // console.log(meals[i]);
            addMeal(meals[i]);
        }
    });

    api.getWeeklyMeals(localStorage.getItem("userId")).then(meals => {
        console.log("Setting local storage for weekly meals");
        localStorage.setItem("weeklyMeals", JSON.stringify(meals));
    }).then(() => {
        generateCharts();
    });
});

let recContainer = document.querySelector(".recContainer");
recContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("recItem")) {
        console.log("click");
        let recipes = JSON.parse(localStorage.getItem("recipes"));
        recipes.forEach(recipe => {
            console.log("RecipeName: " + recipe.name);
            console.log("InnerHTML: " + e.target.innerHTML);
            if (recipe.name == e.target.innerHTML) {
                console.log("Found recipe");
                console.log(formatDate());
                api.createMeal(localStorage.getItem("userId"), formatDate(), recipe.rec_id).then(() => {
                    window.location.reload();
                }).catch(() => {
                    alertModal();
                });
            }
        });
    }
});

//Add recipe HTML
function addRecipe(recipe) {
    let newRecipe = document.createElement("li");
    newRecipe.classList.add("recItem");
    newRecipe.innerHTML = recipe.name;
    recipeList.append(newRecipe);
}

function formatDate() {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    let day = ('0' + currentDate.getDate()).slice(-2);
    let formattedDate = year + '-' + month + '-' + day;
    return formattedDate;
}

function formatDatePrevious(daysPast) {
    let currentDate = new Date();
    currentDate.setHours(currentDate.getHours() - 24 * daysPast);
    let year = currentDate.getFullYear();
    let month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    let day = ('0' + currentDate.getDate()).slice(-2);
    let formattedDate = year + '-' + month + '-' + day;
    return formattedDate;
}

function addMeal(meal) {
    let newMeal = document.createElement("li");
    newMeal.classList.add("mealItem");
    newMeal.id = meal.meals_id;

    // Retrieve recipes from local storage
    const recipesJSON = localStorage.getItem('recipes');

    const recipes = JSON.parse(recipesJSON);
    if (!recipes) {
        return;
    } else {
        recipes.forEach(recipe => {
            if (recipe.rec_id == meal.rec_id) {
                newMeal.innerHTML = recipe.name;
            }
        });
    }
    consumptionList.append(newMeal);
}

// when one of the meals is clicked, it will be deleted
let conContainer = document.querySelector(".consumptionContainer");
conContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("mealItem")) {
        console.log("click");
        api.deleteMeal(e.target.id).then(() => {
            window.location.reload();
        }).catch(() => {
            alertModal();
        });
    }
});

// Modal pop-up function
function alertModal() {
    let modal = new bootstrap.Modal('#offlineModal', {
        keyboard: false
    });
    modal.show();
}

/**
 * CHART CREATION
 */
function generateCharts() {
    // Pie chart
    const xValues = ["Fat", "Protein", "Carbohydrates"];
    const yValues = [];
    const barColors = ["yellow", "red", "orange"];

    let totalFat = 0;
    let totalProtein = 0;
    let totalCarbs = 0;

    // Retrieve meals from local storage
    const mealsJSON = localStorage.getItem('weeklyMeals');
    const meals = JSON.parse(mealsJSON);
    console.log("Grabbing meals for chart");
    console.log(meals);

    // Retrieve recipes from local storage
    const recipesJSON = localStorage.getItem('recipes');
    const recipes = JSON.parse(recipesJSON);

    // Assuming meals and recipes are not null
    meals.forEach(meal => {
        recipes.forEach(recipe => {
            if (meal.rec_id == recipe.rec_id) {
                totalFat += recipe.fat;
                totalProtein += recipe.protein;
                totalCarbs += recipe.carbs;
            }
        });
    });

    yValues.push(totalFat);
    yValues.push(totalProtein);
    yValues.push(totalCarbs);

    const pieChart = new Chart(
        document.getElementById('distribution'),
        {
            type: "pie",
            data: {
                labels: xValues,
                datasets: [{
                    backgroundColor: barColors,
                    data: yValues
                }]
            },
            options: {
                legend: {
                    labels: {
                         fontColor: 'black'
                        }
                     },
                title: {
                    display: true,
                    fontColor: 'black',
                    text: "Weekly Distribution of Macro-nutrients"
                }
            }
        }
    );

    // Stats
    const fat_goal = [];
    const protein_goal = [];
    const carb_goal = [];
    const cal_goal = [];
    api.getUserStats(localStorage.getItem("userId")).then(stats => {
        for (let x = 0; x < 7; x++) {
            fat_goal.push(stats[0].fat_goal);
            protein_goal.push(stats[0].protein_goal);
            carb_goal.push(stats[0].carb_goal);
            cal_goal.push(stats[0].cal_goal);
        }
    });

    // Day labels
    const labels = [];
    for (let x = 0; x < 7; x++) {
        labels.push(formatDatePrevious(x));
    }

    // Fat chart
    const L7fat = [];
    let daysFat = 0;

    for (let x = 0; x < 7; x++) {
        meals.forEach(meal => {
            if (meal.date.split("T")[0] == formatDatePrevious(x)) {
                recipes.forEach(recipe => {
                    if (meal.rec_id == recipe.rec_id) {
                        daysFat += recipe.fat;
                    }
                });
            }
        });
        L7fat.push(daysFat);
        daysFat = 0;
    }

    let fatChart = new Chart(
        document.getElementById('weeklyFat'),
        {
            type: 'bar',
            data: {
                datasets: [{
                    label: 'Fat Consumed',
                    data: L7fat,
                    backgroundColor: ["yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow"],
                    // this dataset is drawn below
                    order: 2
                }, {
                    label: 'Fat Goal',
                    data: fat_goal,
                    fill: false,
                    borderColor: 'black',
                    type: 'line',
                    // this dataset is drawn on top
                    order: 1
                }],
                labels: labels
            },
            options: {
                legend: {
                    labels: {
                         fontColor: 'black'
                        }
                     },
                title: {
                    display: true,
                    fontColor: 'black',
                    text: "Weekly Fat Consumption"
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            fontColor: 'black'
                        },
                    }],
                  xAxes: [{
                        ticks: {
                            fontColor: 'black'
                        }
                    }]
                } 
            }
        }
    )


    // Protein chart
    const L7protein = [];
    let daysProtein = 0;

    for (let x = 0; x < 7; x++) {
        meals.forEach(meal => {
            if (meal.date.split("T")[0] == formatDatePrevious(x)) {
                recipes.forEach(recipe => {
                    if (meal.rec_id == recipe.rec_id) {
                        daysProtein += recipe.protein;
                    }
                });
            }
        });
        L7protein.push(daysProtein);
        daysProtein = 0;
    }

    let proteinChart = new Chart(
        document.getElementById('weeklyProtein'),
        {
            type: 'bar',
            data: {
                datasets: [{
                    label: 'Protein Consumed',
                    backgroundColor: ["red", "red", "red", "red", "red", "red", "red"],
                    data: L7protein,
                    // this dataset is drawn below
                    order: 2
                }, {
                    label: 'Protein Goal',
                    data: protein_goal,
                    fill: false,
                    borderColor: 'black',
                    type: 'line',
                    // this dataset is drawn on top
                    order: 1
                }],
                labels: labels
            },
            options: {
                legend: {
                    labels: {
                         fontColor: 'black'
                        }
                     },
                title: {
                    display: true,
                    fontColor: 'black',
                    text: "Weekly Protein Consumption"
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            fontColor: 'black'
                        },
                    }],
                  xAxes: [{
                        ticks: {
                            fontColor: 'black'
                        }
                    }]
                } 
            }
        }
    )

    // Carbs chart
    const L7carbs = [];
    let daysCarbs = 0;

    for (let x = 0; x < 7; x++) {
        meals.forEach(meal => {
            if (meal.date.split("T")[0] == formatDatePrevious(x)) {
                recipes.forEach(recipe => {
                    if (meal.rec_id == recipe.rec_id) {
                        daysCarbs += recipe.carbs;
                    }
                });
            }
        });
        L7carbs.push(daysCarbs);
        daysCarbs = 0;
    }

    let carbsChart = new Chart(
        document.getElementById('weeklyCarbs'),
        {
            type: 'bar',
            data: {
                datasets: [{
                    label: 'Carbs Consumed',
                    data: L7carbs,
                    backgroundColor: ["orange", "orange", "orange", "orange", "orange", "orange", "orange"],
                    // this dataset is drawn below
                    order: 2
                }, {
                    label: 'Carb Goal',
                    data: carb_goal,
                    type: 'line',
                    fill: false,
                    borderColor: 'black',
                    // this dataset is drawn on top
                    order: 1
                }],
                labels: labels
            },
            options: {
                legend: {
                    labels: {
                         fontColor: 'black'
                        }
                     },
                title: {
                    display: true,
                    fontColor: 'black',
                    text: "Weekly Carb Consumption"
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            fontColor: 'black'
                        },
                    }],
                  xAxes: [{
                        ticks: {
                            fontColor: 'black'
                        }
                    }]
                } 
            }
        }
    )

    // Cals chart
    const L7cals = [];
    let daysCals = 0;

    for (let x = 0; x < 7; x++) {
        meals.forEach(meal => {
            if (meal.date.split("T")[0] == formatDatePrevious(x)) {
                recipes.forEach(recipe => {
                    if (meal.rec_id == recipe.rec_id) {
                        daysCals += recipe.cals;
                    }
                });
            }
        });
        L7cals.push(daysCals);
        daysCals = 0;
    }


    let calsChart = new Chart(
        document.getElementById('weeklyCals'),
        {
            type: 'bar',
            data: {
                datasets: [{
                    label: 'Calorie Goal',
                    data: cal_goal,
                    type: 'line',
                    fill: false,
                    borderColor: 'black'
                    // this dataset is drawn on top
                }, {
                    label: 'Calories Consumed',
                    data: L7cals,
                    backgroundColor: ['grey', 'grey', 'grey', 'grey', 'grey', 'grey', 'grey']
                    // this dataset is drawn below
                }
                ],
                labels: labels
            },
            options: {
                legend: {
                    labels: {
                         fontColor: 'black'
                        }
                     },
                title: {
                    display: true,
                    fontColor: 'black',
                    text: "Weekly Calorie Consumption"
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            fontColor: 'black'
                        },
                    }],
                  xAxes: [{
                        ticks: {
                            fontColor: 'black'
                        }
                    }]
                } 
            }
        }
    )

    let calGoal = document.getElementById('cal-goal');
    let proteinGoal = document.getElementById('protein-goal');
    console.log("user_id is " + localStorage.getItem("userId"));
    // if the user is new and

    api.getUserStats(localStorage.getItem("userId")).then(stats => {
        console.log(stats);
        let caloricDailyGoal = stats[0].cal_goal;
        let calDiff = caloricDailyGoal - L7cals[0];
        if (calDiff > 0) {
            calGoal.innerHTML = "You need to consume " + calDiff + " more calories to reach your goal";
        } else {
            calGoal.innerHTML = "You have exceeded your goal by " + Math.abs(calDiff) + " calories";
        }

        let proteinDailyGoal = stats[0].protein_goal;
        let proteinDiff = proteinDailyGoal - L7protein[0];
        if (proteinDiff > 0) {
            proteinGoal.innerHTML = "You need to consume " + proteinDiff + " more grams of protein to reach your goal";
        } else {
            proteinGoal.innerHTML = "You have exceeded your protein goal by " + Math.abs(proteinDiff) + " grams";
        }
    });

    setTimeout(function () {
        proteinChart.update();
        carbsChart.update();
        fatChart.update();
        pieChart.update();
        calsChart.update();
    }, 1000);
}