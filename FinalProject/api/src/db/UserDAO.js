const db = require('./DBConnection.js');
const User = require('./models/User');

function getUserByCredentials(username, password) {
  return db.query('SELECT * FROM user WHERE username=?', [username]).then(({ results }) => {
    const user = new User(results[0]);
    if (user) { // we found our user
      return user.validatePassword(password);
    }
    else { // if no user with provided username
      throw new Error("No such user");
    }
  });
}

function createUser(user) {
  return db.query('INSERT INTO user (first_name, last_name, username, avatar, salt, password) VALUES (?, ?, ?, ?, ?, ?)',
    [user.first_name, user.last_name, user.username, user.avatar, user.salt, user.password]).then(({ results }) => {
      return getUserById(results.insertId);
    });
}

function getUserByUsername(username) {
  return db.query('SELECT * FROM user WHERE username=?', [username]).then(({ results }) => {
    const user = new User(results[0]);
    if (user) {
      return user;
    }
    else {
      throw new Error("No such user");
    }
  });
}

function getUserById(userId) {
  return db.query('SELECT * FROM user WHERE user_id=?', [userId]).then(({ results }) => {
    return results.map(user => new User(user));;
  });
}

module.exports = {
  getUserByCredentials: getUserByCredentials,
  getUserByUsername: getUserByUsername,
  createUser: createUser,
  getUserById: getUserById
};