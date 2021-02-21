const { Router } = require('express');

const productController = require('./controllers/productController');

const authController = require('./controllers/authController');



const router = Router();
router.use('/auth', authController);
router.use('/', productController);	
router.use('/products', productController);	


router.get('*', (req, res) => {
    res.status('404').render('./notFound/404.hbs');
});

module.exports = router;