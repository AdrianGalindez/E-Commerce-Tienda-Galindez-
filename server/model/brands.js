const mongoose = require('mongoose');

var schema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true,
        unique: true
    }

})

const Marcadb = mongoose.model('marcadb', schema);

module.exports = Brand_db;
