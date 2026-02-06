const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({ status: 'Available' })
            .populate('user', 'name avatar studentId');

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
        const { title, description, price, category } = req.body;

        await Product.create({
            title,
            description,
            price,
            category,
            user: req.user.id
        });

        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.render('products/create', {
            title: 'Sell Item',
            user: req.user,
            error: 'Error creating product',
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