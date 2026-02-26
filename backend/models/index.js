const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');

const Favorite = sequelize.define('Favorite', {
    UserId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
    ProductId: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'id',
        },
    },
});

User.belongsToMany(Product, { through: Favorite, as: 'Favorites' });
Product.belongsToMany(User, { through: Favorite, as: 'FavoritedBy' });

module.exports = { User, Product, Favorite };
