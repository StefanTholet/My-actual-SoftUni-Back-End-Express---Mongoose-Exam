const mongoose = require('mongoose');
const { ensurePositiveNumber } = require('./helpers/validators');


const productSchema = new mongoose.Schema({
    merchant: {
        type: String,
        required: [true, 'Merchant must be specified'],
        minlength: [4, 'The merchant name must be at least 4 characters'],
    },
    total: {
        type: Number,
        required: [true, 'The total is required'],
        validate: {
            validator: ensurePositiveNumber,
            message: 'The total can not be lower than 0'
        }
    },
    category: {
        type: String,
        required: [true, 'Please provide a category']
    },
    description: {
        type: String,
        required: [true, 'A description is required'],
        minlength: [3, 'Description must be at least 3 characters long'],
        maxlength: [30, 'Description can\'t be longer than 30 characters'],
    },
    report: {
        type: Boolean,
        required: [true, 'A report decision must be provided'],
        default: false
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
});

module.exports = mongoose.model('Product', productSchema);

//buddies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] array of referenced ids