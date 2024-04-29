module.exports = class Meal {
  meals_id = null;
  user_id = null;
  date = null;
  rec_id = null;

  constructor(data) {
    this.meals_id = data.meals_id;
    this.user_id = data.user_id;
    this.date = data.date;
    this.rec_id = data.rec_id;
  }
}