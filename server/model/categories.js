const mongoose = require('mongoose');

var schema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true,
        unique: true
    }

})

const Categoriadb = mongoose.model('categoriadb', schema);

module.exports = Categoryadb;
