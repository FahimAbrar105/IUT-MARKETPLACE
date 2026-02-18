const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProduct,
    createProductForm,
    createProduct,
    deleteProduct,
    createLimitOrder,
    deleteLimitOrder,
    holdProduct,
    unholdProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getProducts);

router.get('/create', protect, createProductForm);
router.post('/', protect, (req, res, next) => {
    upload.array('images', 5)(req, res, (err) => {
        if (err) {
            console.error('[UPLOAD ERROR]', err);
            return res.render('products/create', {
                title: 'Sell Item',
                user: req.user,
                error: 'Image Upload Failed: ' + err.message,
                formData: req.body
            });
        }
        next();
    });
}, createProduct);
router.post('/orders', protect, createLimitOrder);
router.post('/orders/:id/delete', protect, deleteLimitOrder);

router.post('/:id/hold', protect, holdProduct);
router.delete('/:id/hold', protect, unholdProduct);

router.get('/:id', getProduct);

router.post('/:id/delete', protect, deleteProduct);

module.exports = router;

