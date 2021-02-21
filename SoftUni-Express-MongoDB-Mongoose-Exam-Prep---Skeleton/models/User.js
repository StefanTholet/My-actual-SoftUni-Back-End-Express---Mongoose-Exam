const mongoose = require('mongoose');
const usernameRegex = /^\w+$/;

const { validateRegex, ensureUnique, ensurePositiveNumber } = require('./helpers/validators');

const userSchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    username: {
        type: String,
        required: [true, 'Username is required'],
        minlength: [4, 'Username must be at least 4 characters long'],
        validate: [
            {
                validator: ensureUnique.bind(undefined, ['User', 'username']),
                message: 'This username is already taken',
            },
            {
                validator: validateRegex.bind(undefined, [usernameRegex]),
                message: 'Username should consist of English letters and digits only',
            }]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [4, 'Password must be at least 4 characters long' ]
    },
    amount: {
        type: Number,
        default: 0,
        required: [true, 'Please provide account amount'],
        min: [0, 'Your account balance can not be lower than 0'],
        validate: {
            validator: ensurePositiveNumber,
            message: 'Your account balance can not be lower than 0'
        }
    },
    expenses: [{ type: mongoose.Schema.ObjectId, ref: 'Product' }],
});

module.exports = mongoose.model('User', userSchema);

