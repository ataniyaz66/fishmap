const AppError = require('../utils/app-error');
const User = require('../models/user.model');

function notImplemented(operation) {
  throw new AppError(`${operation} persistence is not implemented yet.`, 501, 'NOT_IMPLEMENTED');
}

function findByEmail(email) {
  return User.findOne({ where: { email } });
}

function findByUsername(username) {
  return User.findOne({ where: { username } });
}

function create(userData) {
  return User.create(userData);
}

module.exports = { notImplemented, findByEmail, findByUsername, create };
