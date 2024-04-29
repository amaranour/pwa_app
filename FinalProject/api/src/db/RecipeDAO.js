const db = require('./DBConnection');
const Recipe = require('./models/Recipe');

function getRecipes() {
  return db.query('SELECT * FROM recipes').then(({ results }) => {
    return results.map(recipe => new Recipe(recipe));;
  });
}

function getRecipeById(recipeId) {
  return db.query('SELECT * FROM recipes WHERE rec_id = ?', [recipeId]).then(({ results }) => {
    return results.map(recipe => new Recipe(recipe));;
  });
}

function getRecipesByUserId(userId) {
  return db.query('SELECT * FROM recipes WHERE user_id = ?', [userId]).then(({ results }) => {
    return results.map(recipe => new Recipe(recipe));;
  });
}

function createRecipe(recipe) {
  return db.query('INSERT INTO recipes (name, fat, protein, carbs, cals, user_id) VALUES (?, ?, ?, ?, ?, ?)',
    [recipe.name, recipe.fat, recipe.carbs, recipe.protein, recipe.cals, recipe.user_id]).then(({ results }) => {
      return getRecipeById(results.insertId);
    });
}

module.exports = {
  getRecipes: getRecipes,
  getRecipeById: getRecipeById,
  createRecipe: createRecipe,
  getRecipesByUserId: getRecipesByUserId
};
