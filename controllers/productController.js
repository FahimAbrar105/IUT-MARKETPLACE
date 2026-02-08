const Product = require('../models/Product');
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
        res.render('products/index', {
            title: 'Marketplace',
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

        res.render('products/details', {
            title: product.title,
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


        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.render('products/create', {
            title: 'Sell Item',
            user: req.user,
            error: 'Error creating product. Please try again.',
            formData: req.body
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