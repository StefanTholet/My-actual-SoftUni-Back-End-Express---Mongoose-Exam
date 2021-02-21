const router = require('express').Router();
const authService = require('../services/authService');

const errorCompiler = require('../controllers/helpers/errorCompiler')
const { COOKIE_NAME } = require('../config');

router.get('/login', (req, res) => {
    res.render('./guests/login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        let token = await authService.login({ username, password });
        res.cookie(COOKIE_NAME, token);
        res.redirect('/');
    } catch (error) {	
        const errors = errorCompiler(error);	
        console.log(`Login unsuccessful: ${errors[0].message}`)	
        res.render('./guests/login', { errors })	
    }	
});

router.get('/register', (req, res) => {
    res.render('./guests/register');
});

router.post('/register', async (req, res) => {
    let { username, password, repeatPassword, amount } = req.body; 
    try {
        if (password !== repeatPassword) {
            throw new Error('Passwords missmatch!');
        }
        amount == '' ? amount = 0 : null;
        let user = await authService.register({ username, password, amount });
        let token = await authService.login({ username, password });
        res.cookie(COOKIE_NAME, token);
        res.redirect('/');
    } catch (error) {	
        const errors = errorCompiler(error);	
        console.log(`Registration unsuccessful: ${errors[0].message}`)	
        res.render('./guests/register', { errors })	
    }	
});

router.get('/logout', (req, res) => {
    res.clearCookie(COOKIE_NAME);
    res.redirect('/');
});

router.get('*', (req, res) => {
    res.status('404').render('./notFound/404.hbs');
});

module.exports = router;
