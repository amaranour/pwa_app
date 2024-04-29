const db = require('./DBConnection');
const Meal = require('./models/Meal');

// Create a meal
function createMeal(meal) {
  return db.query('INSERT INTO meals (user_id, date, rec_id) VALUES (?, ?, ?)',
    [meal.user_id, meal.date, meal.rec_id]).then(({ results }) => {
      return getMealById(results.insertId);
    });
}

// Get meal by id
function getMealById(mealId) {
  return db.query('SELECT * FROM meals WHERE meals_id = ?', [mealId]).then(({ results }) => {
    return results.map(meal => new Meal(meal));;
  });
}

// Get last 7 days
function getWeeklyMeals(userId) {
  let currentDate = new Date();
  // Go back 4 hours to account for UTC offset
  currentDate.setHours(currentDate.getHours() - 4);
  let year = currentDate.getFullYear();
  let month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
  let day = ('0' + currentDate.getDate()).slice(-2);
  let formattedDate = year + '-' + month + '-' + day;
  return db.query('SELECT * FROM meals WHERE user_id = ?', [userId]).then(({ results }) => {
    return results.map(meal => new Meal(meal));
  });
}

// Get latest day's meals
function getDailyMeals(userId) {
  let currentDate = new Date();
  // Go back 4 hours to account for UTC offset
  currentDate.setHours(currentDate.getHours() - 4);
  let year = currentDate.getFullYear();
  let month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
  let day = ('0' + currentDate.getDate()).slice(-2);
  let formattedDate = year + '-' + month + '-' + day;
  console.log(formattedDate);
  console.log(currentDate.getDate());

  return db.query('SELECT * FROM meals WHERE user_id = ? AND date = ?', [userId, formattedDate]).then(({ results }) => {
    return results.map(meal => new Meal(meal));;
  });
}

// Delete meal
function deleteMeal(mealId) {
  return db.query('DELETE FROM meals WHERE meals_id = ?', [mealId]).then(({ results }) => {
    return results;
  });
}

module.exports = {
  createMeal: createMeal,
  getMealById: getMealById,
  getWeeklyMeals: getWeeklyMeals,
  getDailyMeals: getDailyMeals,
  deleteMeal: deleteMeal
};