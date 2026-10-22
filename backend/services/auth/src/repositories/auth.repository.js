const { Op, fn, col, where } = require('sequelize');
const { sequelize } = require('../database/connection');
const { User, RefreshToken, PasswordReset, EmailVerification } = require('../models');

function findByEmail(email) {
  if (!email) return null;
  const lowerEmail = email.toLowerCase().trim();
  return User.findOne({
    where: where(fn('LOWER', col('email')), lowerEmail)
  });
}

function findByUsername(username) {
  if (!username) return null;
  const lowerUsername = username.toLowerCase().trim();
  return User.findOne({
    where: where(fn('LOWER', col('username')), lowerUsername)
  });
}

function findById(id) {
  if (!id) return null;
  return User.findByPk(id);
}

function createUser(userData) {
  return User.create(userData);
}

function updateUserPassword(id, passwordHash) {
  return User.update({ passwordHash }, { where: { id } });
}

function createRefreshToken(tokenData) {
  return RefreshToken.create(tokenData);
}

function findRefreshTokenByHash(tokenHash) {
  if (!tokenHash) return null;
  return RefreshToken.findOne({
    where: { tokenHash }
  });
}

function revokeRefreshToken(tokenHash) {
  if (!tokenHash) return Promise.resolve([0]);
  return RefreshToken.update(
    { isRevoked: true },
    { where: { tokenHash } }
  );
}

function revokeFamily(familyId) {
  if (!familyId) return Promise.resolve([0]);
  return RefreshToken.update(
    { isRevoked: true },
    { where: { familyId } }
  );
}

function deleteExpiredTokens() {
  return RefreshToken.destroy({
    where: {
      expiresAt: {
        [Op.lt]: new Date()
      }
    }
  });
}

function createPasswordReset(data) {
  return PasswordReset.create(data);
}

function findPasswordResetByHash(tokenHash) {
  return PasswordReset.findOne({ where: { tokenHash } });
}

function markPasswordResetUsed(id) {
  return PasswordReset.update({ isUsed: true }, { where: { id } });
}

function createEmailVerification(data) {
  return EmailVerification.create(data);
}

function findEmailVerificationByHash(tokenHash) {
  return EmailVerification.findOne({ where: { tokenHash } });
}

function markEmailVerified(id) {
  return EmailVerification.update({ isUsed: true }, { where: { id } });
}

module.exports = {
  findByEmail,
  findByUsername,
  findById,
  createUser,
  updateUserPassword,
  createRefreshToken,
  findRefreshTokenByHash,
  revokeRefreshToken,
  revokeFamily,
  deleteExpiredTokens,
  createPasswordReset,
  findPasswordResetByHash,
  markPasswordResetUsed,
  createEmailVerification,
  findEmailVerificationByHash,
  markEmailVerified
};
