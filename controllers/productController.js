const Product = require('../models/Product');
const LimitOrder = require('../models/LimitOrder');
const path = require('path');
const fs = require('fs');

exports.getProducts = async (req, res) => {
    try {
        let query = { status: 'Available' };
        if (req.user) {
            query.user = { $ne: req.user.id };
        }

        if (req.query.sector) {
            query.category = { $regex: new RegExp('^' + req.query.sector + '$', 'i') };
        }

        if (req.query.maxPrice) {
            query.price = { $lte: req.query.maxPrice };
        }
        const products = await Product.find(query).populate('user', 'name avatar studentId');
        res.json({
            products,
            user: req.user
        });
    } catch (err) {
        console.error(err);
        res.render('error', { error: 'Server Error' });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('user', 'name email avatar studentId');

        if (!product) {
            return res.render('error', { error: 'Product not found' });
        }

        res.json({
            product,
            user: req.user
        });
    } catch (err) {
        console.error(err);
        res.status(404).render('error', { error: 'Product not found' });
    }
};

exports.createProductForm = (req, res) => {
    res.render('products/create', { title: 'Sell Item', user: req.user });
};

exports.createProduct = async (req, res) => {
    try {
        const { title, description, price, category, isAnonymous } = req.body;


        let images = [];
        if (req.files) {
            req.files.forEach(file => {
                images.push(file.path);
            });
        }

        await Product.create({
            title,
            description,
            price,
            category,
            images,
            isAnonymous: isAnonymous === 'on',
            user: req.user.id
        });


        const matchingOrders = await LimitOrder.find({
            sector: category,
            maxPrice: { $gte: price },
            status: 'ACTIVE',
            user: { $ne: req.user.id }
        });

        if (matchingOrders.length > 0) {
            for (const order of matchingOrders) {
                order.status = 'FILLED';
                await order.save();
            }
        }

        res.json({ success: true, message: 'Product created successfully' });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            error: err.message || 'Error creating product'
        });
    }
};


exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        if (product.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        await product.deleteOne();

        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
};

exports.createLimitOrder = async (req, res) => {
    try {
        const { sector, maxPrice } = req.body;

        await LimitOrder.create({
            user: req.user.id,
            sector,
            maxPrice
        });

        res.json({ success: true, message: 'Limit Order Created' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.deleteLimitOrder = async (req, res) => {
    try {
        const order = await LimitOrder.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        if (order.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        await order.deleteOne();
        console.log(`[ORDER] Limit Order ${req.params.id} cancelled by user`);

        res.json({ success: true, message: 'Limit Order Cancelled' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
