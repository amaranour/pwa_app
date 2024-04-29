const db = require('./DBConnection');
const Stats = require('./models/Stats');

function getStatsByUserId(userId) {
  return db.query('SELECT * FROM stats WHERE user_id = ?', [userId]).then(({ results }) => {
    // Empty array if no stats found
    if (results.length === 0) {
      return [];
    }
    return results.map(stats => new Stats(stats));;
  });
}

function createStats(stats) {
  return db.query('INSERT INTO stats (user_id, height, weight, cal_goal, protein_goal, carb_goal, fat_goal) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [stats.user_id, stats.height, stats.weight, stats.cal_goal, stats.protein_goal, stats.carb_goal, stats.fat_goal]).then(({ results }) => {
      console.log(results);
      return getStatsByUserId(results.insertId);
    });
}

function updateStats(stats) {
  return db.query('UPDATE stats SET height=?, weight=?, cal_goal=?, protein_goal=?, carb_goal=?, fat_goal=? WHERE user_id=?',
    [stats.height, stats.weight, stats.cal_goal, stats.protein_goal, stats.carb_goal, stats.fat_goal, stats.user_id]).then(({ results }) => {
      return getStatsByUserId(stats.user_id);
    });
}

module.exports = {
  getStatsByUserId: getStatsByUserId,
  createStats: createStats,
  updateStats: updateStats
};