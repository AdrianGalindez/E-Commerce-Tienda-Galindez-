const mongoose = require('mongoose');

var schema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true
    },   
    descripcion: {
        type: String,
    },    
    foto: {
        type: String,
    },    
    marca: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'marcadb',
        required: true
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categoriadb',
        required: true
    },
    proveedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'proveedordb'
    },
    precio: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        default: 0
    },
    fechaIngreso: {
        type: Date,
        default: Date.now
    }

})

const Productodb = mongoose.model('productodb', schema);

module.exports = Productodb;
