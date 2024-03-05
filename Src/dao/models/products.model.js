const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const productCollection = "products";

const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        required: true,
    },
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    code: String,
    stock: Number,
});

productSchema.plugin(mongoosePaginate);
const ProductModel = mongoose.model(productCollection, productSchema);

module.exports = ProductModel;
