const authRepository = require('../repositories/auth.repository');

function register(payload) {
  return authRepository.notImplemented('User registration');
}

function login(payload) {
  return authRepository.notImplemented('User login');
}

function refresh(payload) {
  return authRepository.notImplemented('Refresh token');
}

function logout(payload) {
  return authRepository.notImplemented('Logout');
}

module.exports = { register, login, refresh, logout };
