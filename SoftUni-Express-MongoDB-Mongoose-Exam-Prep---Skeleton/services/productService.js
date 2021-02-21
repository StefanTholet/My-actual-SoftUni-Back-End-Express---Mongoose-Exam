const Product = require('../models/Product');
const User = require('../models/User')

async function getAll(id) {
    let products = await Product.find({creator: id}).lean();
    return products;
}

function getOne(id) {
    return Product.findById(id).lean();
}

function create(data, userId) {
    let product = new Product({ ...data, creator: userId });
    return product.save();
}

function updateOne(productId, productData) {
    return Product.updateOne({ _id: productId }, productData);
}

function deductUserAmount(_id, total) {
    return User.updateOne({ _id },
        { $inc: { amount: - total } }
    );
}

function addFunds(_id, total) {
    return User.updateOne({ _id },
        { $inc: { amount: total } }
    );
}

// function deductUserAmount(_id, total) {
//         return User.findById({ _id })
//         .then(user => {
//             user.total -= total;
//             user.save()
//         })
//     }

function deleteOne(_id) {	
    return Product.deleteOne({ _id });	
}

function updateDbArray(Document, id, arrayName, element) {	
    return Document.updateOne(	
        { _id: id },	
        { $push: { [arrayName]: element } }	
    )		
}

function getPopulated(id) {
    return User.findById(id)
        .populate('expenses')
        .lean();
}

module.exports = {
    updateDbArray,
    getAll,
    getOne,
    getPopulated,
    create,
    updateOne,
    deleteOne,
    //getAllSold
    deductUserAmount,
    addFunds
}

//bonnus
// function getAllSold(userId) {
//     return Product.find({ creator: userId }).lean();
// }
