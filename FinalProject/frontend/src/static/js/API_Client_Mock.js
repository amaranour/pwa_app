// Code for the API Client Mock
import HTTPClient from "./HTTPClient.js";
const API_BASE = '/api';

function checkResponse(res) {
  if (!res.ok) {
    throw new Error("There was an error in fetch");
  }
  return res;
}

function handleError(error) {
  console.log("ERROR", error);
  throw error;
}

//login 
const login = (username, password) => {
  console.log(username, password)
  const data = {
    username: username,
    password: password
  }
  return HTTPClient.post(`${API_BASE}/users/login`, data);
};



// get all users
const getUsers = () => {
  return fetch(`${API_BASE}/users`)
    .then(checkResponse)
    .then(res => {
      return res.json();
    })
    .then(users => {
      return users;
    })
    .catch(handleError);
};


// get user by id
const getUsersbyId = (userId) => {
  return fetch(API_BASE + `/users/${userId}`)
    .then(checkResponse)
    .then(res => {
      return res.json();
    })
    .then(user => {
      return user;
    })
    .catch(handleError);
}



// create user
const createUser = (firstName, lastName, username, password) => {
  const data = {
    first_name: firstName,
    last_name: lastName,
    username: username,
    password: password

  }
  console.log(data);

  return HTTPClient.post(`${API_BASE}/users`, data);

};

// update user
const updateUser = (user) => {
  return fetch(`${API_BASE}/users/${user.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
    .then(checkResponse)
    .then(res => {
      return res.json();
    })
    .catch(handleError);
};

// delete user
const deleteUser = (userId) => {
  return fetch(`${API_BASE}/users/${userId}`, {
    method: 'DELETE'
  })
    .then(checkResponse)
    .then(res => {
      return res.json();
    })
    .catch(handleError);
};

// create recipe
const createRecipe = (name, fat, protein, carbs, cals, user_id) => {
  const data = {
    name: name,
    fat: fat,
    protein: protein,
    carbs: carbs,
    cals: cals,
    user_id: user_id
  }
  console.log(data);

  return HTTPClient.post(`${API_BASE}/users/recipes`, data);
};

const getCurrentUser = () => {
  return HTTPClient.get(`${API_BASE}/users/current`);
}

// update recipe
const updateRecipe = (recipe) => {
  return fetch(`${API_BASE}/recipes/${recipe.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(recipe)
  })
    .then(checkResponse)
    .then(res => {
      return res.json();
    })
    .catch(handleError);
};

// get all recipes
const getRecipes = () => {
  return fetch(`${API_BASE}/recipes`)
    .then(checkResponse)
    .then(res => {
      return res.json();
    })
    .then(recipes => {
      return recipes;
    })
    .catch(handleError);
};

// get recipe by id
const getRecipebyId = (recipeId) => {
  return fetch(API_BASE + `/users/${recipeId}/recipes`)
    .then(checkResponse)
    .then(res => {
      return res.json();
    })
    .then(recipe => {
      return recipe;
    })
    .catch(handleError);
}

// get all recipes for a user
const getRecipesbyUser = (userId) => {
  return fetch(API_BASE + `/users/${userId}/recipes`)
    .then(checkResponse)
    .then(res => {
      return res.json();
    })
    .then(recipes => {
      return recipes;
    })
    .catch(handleError);
}

const getUserStats = (userId) => {
  return HTTPClient.get(`${API_BASE}/users/stats/${userId}`);
}
// (user_id, height, weight, cal_goal, protein_goal, carb_goal, fat_goal)
const createUserStats = (user_id, height, weight, cal_goal, protein_goal, carb_goal, fat_goal) => {
  const data = {
    user_id: user_id,
    height: height,
    weight: weight,
    cal_goal: cal_goal,
    protein_goal: protein_goal,
    carb_goal: carb_goal,
    fat_goal: fat_goal
  }
  console.log(data);

  return HTTPClient.post(`${API_BASE}/users/stats`, data)
}

const updateUserStats = (user_id, height, weight, cal_goal, protein_goal, carb_goal, fat_goal) => {
  const data = {
    user_id: user_id,
    height: height,
    weight: weight,
    cal_goal: cal_goal,
    protein_goal: protein_goal,
    carb_goal: carb_goal,
    fat_goal: fat_goal
  }
  console.log(data);

  return HTTPClient.put(`${API_BASE}/users/stats`, data)
}

// create meal
const createMeal = (user_id, date, rec_id) => {
  const data = {
    user_id: user_id,
    date: date,
    rec_id: rec_id
  }
  console.log(data);

  return HTTPClient.post(`${API_BASE}/users/meals`, data);
};

// delete meal
const deleteMeal = (mealId) => {
  // return HTTPClient.delete(`${API_BASE}/users/${mealId}/meals`);
  return fetch(API_BASE + `/users/${mealId}/meals`, {
    method: 'DELETE'
  }).catch(handleError);
};

// get todays Meals
const getDailyMeals = (userId) => {
  // return HTTPClient.get(`${API_BASE}/users/${userId}/meals/daily`, data);
  return fetch(API_BASE + `/users/${userId}/meals/daily`)
    .then(checkResponse)
    .then(res => {
      return res.json();
    })
    .then(meals => {
      return meals;
    })
    .catch(handleError);
};

// Get weekly meals
const getWeeklyMeals = (userId) => {
  return fetch(API_BASE + `/users/${userId}/meals/weekly`)
    .then(checkResponse)
    .then(res => {
      return res.json();
    })
    .then(meals => {
      return meals;
    })
    .catch(handleError);
};

export default {
  login,
  getUsers,
  getUsersbyId,
  createUser,
  updateUser,
  deleteUser,
  createRecipe,
  updateRecipe,
  getRecipes,
  getRecipebyId,
  getRecipesbyUser,
  getCurrentUser,
  getUserStats,
  createUserStats,
  updateUserStats,
  createMeal,
  deleteMeal,
  getDailyMeals,
  getWeeklyMeals
}
