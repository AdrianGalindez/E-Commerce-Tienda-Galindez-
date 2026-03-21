const mongoose = require('mongoose');

var schema = new mongoose.Schema({

    nombre : {
        type : String,
        required: true
    },

    email : {
        type: String,
        required: true,
        unique: true
    },

    telefono : {
        type: String,
        required: true
    },

    genero : {
        type: String
    },

    direccion : {
        type: String,
        required: true
    },

    barrio : {
        type: String
    },

    ciudad : {
        type: String,
        default: "Bogotá"
    },

    puntoReferencia : {
        type: String,
    },

    ubicacion : {
        lat: Number,
        lng: Number
       
    },

    estado : {
        type : String,
        default: "Activo"
    },

    fechaRegistro : {
        type: Date,
        default: Date.now
    }

})

const Userdb = mongoose.model('userdb', schema);

module.exports = Userdb;