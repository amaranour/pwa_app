module.exports = class Stats {
  stats_id = null;
  user_id = null;
  height = null;
  weight = null;
  cal_goal = null;
  protein_goal = null;
  carb_goal = null;
  fat_goal = null;

  constructor(data) {
    this.id = data.stats_id;
    this.user_id = data.user_id;
    this.height = data.height;
    this.weight = data.weight;
    this.cal_goal = data.cal_goal;
    this.protein_goal = data.protein_goal;
    this.carb_goal = data.carb_goal;
    this.fat_goal = data.fat_goal;
  }
}
