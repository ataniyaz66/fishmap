const User = require('./user.model');
const RefreshToken = require('./refresh-token.model');
const PasswordReset = require('./password-reset.model');
const EmailVerification = require('./email-verification.model');

User.hasMany(RefreshToken, {
  foreignKey: 'userId',
  as: 'refreshTokens',
  onDelete: 'CASCADE'
});

RefreshToken.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

User.hasMany(PasswordReset, {
  foreignKey: 'userId',
  as: 'passwordResets',
  onDelete: 'CASCADE'
});

PasswordReset.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

User.hasMany(EmailVerification, {
  foreignKey: 'userId',
  as: 'emailVerifications',
  onDelete: 'CASCADE'
});

EmailVerification.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

module.exports = {
  User,
  RefreshToken,
  PasswordReset,
  EmailVerification
};
