const authService = require('../services/auth.service');

async function register(req, res, next) {
  try {
    await authService.register(req.body);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    await authService.login(req.body);
  } catch (error) {
    next(error);
  }
}

async function refresh(req, res, next) {
  try {
    await authService.refresh(req.body);
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    await authService.logout(req.body);
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, refresh, logout };
