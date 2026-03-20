const mongoose = require('mongoose');

var schema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true
    },

    telefono: String,

    direccion: String

})

const Proveedordb = mongoose.model('proveedordb', schema);

module.exports = Proveedordb;
