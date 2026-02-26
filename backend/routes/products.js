const express = require('express');
const router = express.Router();
const { Product, Favorite } = require('../models');
const { authenticateToken, optionalAuthenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

// GET /products
router.get('/', optionalAuthenticateToken, async (req, res) => {
    try {
        const { q, category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        const where = {};

        if (q) {
            where.title = { [Op.like]: `%${q}%` };
        }

        if (category) {
            where.category = category;
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
            if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
        }

        const { count, rows } = await Product.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        let products = rows.map(p => p.toJSON());

        if (req.user) {
            const favorites = await Favorite.findAll({
                where: { UserId: req.user.id },
                attributes: ['ProductId'],
            });
            const favoriteIds = new Set(favorites.map(f => f.ProductId));
            products = products.map(p => ({
                ...p,
                isFavorite: favoriteIds.has(p.id)
            }));
        } else {
            products = products.map(p => ({ ...p, isFavorite: false }));
        }

        res.json({
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit),
            products,
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /products/:id
router.get('/:id', optionalAuthenticateToken, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        let productData = product.toJSON();
        if (req.user) {
            const favorite = await Favorite.findOne({
                where: { UserId: req.user.id, ProductId: product.id }
            });
            productData.isFavorite = !!favorite;
        } else {
            productData.isFavorite = false;
        }

        res.json(productData);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /products
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, price, description, image } = req.body;
        const product = await Product.create({ title, price, description, image });
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /products/:id
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { title, price, description, image } = req.body;
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        await product.update({ title, price, description, image });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /products/:id
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        await product.destroy();
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /products/:id/favorite
router.post('/:id/favorite', authenticateToken, async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.user.id;

        const product = await Product.findByPk(productId);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        const favorite = await Favorite.findOne({ where: { UserId: userId, ProductId: productId } });

        if (favorite) {
            await favorite.destroy();
            res.json({ message: 'Removed from favorites', isFavorite: false });
        } else {
            await Favorite.create({ UserId: userId, ProductId: productId });
            res.json({ message: 'Added to favorites', isFavorite: true });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
