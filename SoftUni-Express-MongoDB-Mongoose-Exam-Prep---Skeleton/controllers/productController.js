const { Router } = require('express');

const isAuthenticated = require('../middlewares/isAuthenticated');

const productService = require('../services/productService');

const errorCompiler = require('./helpers/errorCompiler');

const router = Router();

const User = require('../models/User');

router.get('/', (req, res) => {

    if (res.locals.isAuthenticated) {
        productService.getAll(req.user._id)
            .then(expenses => {
                res.render('./users/home', { title: 'Browse', expenses })
            })
            .catch((error) => {
                const errors = errorCompiler(error);
                if (res.locals.isAuthenticated) {
                    res.render('./users/home', { errors })
                } else {
                    res.render('./guests/home', { errors });
                }
            });
    } else {
        res.render('./guests/home', { title: 'Browse' });
    }
});


router.get('/products/create', (req, res) => {
    res.render('./users/create', { title: 'Create' });
});


router.post('/products/create', async (req, res) => {
    const userId = req.user._id;
    const productData = req.body;
    
    productData.report == 'on' ? productData.report = true : productData.report = false;

    productService.deductUserAmount(userId, productData.total).
        then(result => {
            productService.create(productData, userId)
                .then((createdProduct) => {
                    res.redirect('/')
                })
                .catch((error) => {
                    const errors = errorCompiler(error);
                    console.log(`Create unsuccessful: ${errors[0].message}`)
                    res.render('./users/create', { errors })
                })
        })
        .catch((error) => {
            const errors = errorCompiler(error);
            console.log(`User amount update unsuccessful: ${errors[0].message}`)
            res.render('./users/create', { errors })
        })
});


router.get('/products/:productId/report', isAuthenticated, (req, res) => {
    productService.getOne(req.params.productId)
        .then(expense => {
            res.render('./users/details', { title: 'Expense Details', expense })
        })
        .catch(err => { throw err });
});



router.get('/products/:productId/delete', isAuthenticated, (req, res) => {
    productService.deleteOne(req.params.productId)
        .then(result => res.redirect('/'))
});


router.post('/products/add-funds', (req, res) => {
    const userId = req.user._id;
    const fundsToAdd = req.body.funds;
    productService.addFunds(userId, fundsToAdd)
        .then(res.render('./users/home'))
        .catch((error) => {
            const errors = errorCompiler(error);
            console.log(`Fund injection unsuccessful: ${errors[0].message}`)
            res.render('./users/home', { errors })
        })
})


router.get('/user/profile', async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await User.findById(userId)
        const merches = await productService.getAll(userId);
        const profile = {};
        profile.totalExpenseAmount = merches.reduce((acc, merch) => {
            return acc += merch.total;
        }, 0);
        profile.merches = merches.length;
        profile.availableAmount = user.amount;
        res.render('./users/profile', { profile })
    } catch (error) {
        const errors = errorCompiler(error);
        console.log(`Unable to locate user profile: ${errors[0].message}`)
        res.redirect('./users/home', { errors })
    }
});


router.get('*', (req, res) => {
    res.status('404').render('./notFound/404.hbs');
})

module.exports = router;
