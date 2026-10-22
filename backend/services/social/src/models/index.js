const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Post = require('./post.model')(sequelize, DataTypes);
const Comment = require('./comment.model')(sequelize, DataTypes);
const Like = require('./like.model')(sequelize, DataTypes);
const Friendship = require('./friendship.model')(sequelize, DataTypes);
const Notification = require('./notification.model')(sequelize, DataTypes);

// Associations
Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

Post.hasMany(Like, { foreignKey: 'postId', as: 'likes', onDelete: 'CASCADE' });
Like.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

module.exports = {
  sequelize,
  Post,
  Comment,
  Like,
  Friendship,
  Notification
};
