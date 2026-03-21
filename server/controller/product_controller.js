var Productdb = require('../model/product');
const mongoose = require('mongoose');
// create
exports.create = (req, res) => {

    // Validación básica
    if (!req.body.nombre || !req.body.precio || !req.body.stock) {
        return res.status(400).send({ message: "Faltan datos obligatorios" });
    }

    // VALIDACIONES DE OBJECTID 
    if (!mongoose.Types.ObjectId.isValid(req.body.categoria)) {
        return res.status(400).send({ message: "ID de categoría inválido" });
    }
    if (!req.body.proveedor) {
    delete req.body.proveedor;
    }
    if (!mongoose.Types.ObjectId.isValid(req.body.marca)) {
        return res.status(400).send({ message: "ID de marca inválido" });
    }

    if (req.body.proveedor && !mongoose.Types.ObjectId.isValid(req.body.proveedor)) {
        return res.status(400).send({ message: "ID de proveedor inválido" });
    }

    console.log("BODY:", req.body);

    const product = new Productdb({
        nombre: req.body.nombre,
        marca: req.body.marca,
        categoria: req.body.categoria,
        proveedor: req.body.proveedor,
        precio: Number(req.body.precio), 
        stock: Number(req.body.stock)
    });

    product.save()
        .then(data => res.send(data))
        .catch(err => {
            console.error("ERROR REAL:", err);
            res.status(500).send({
                message: err.message
            });
        });
};

// find
exports.find = (req,res)=>{
    if(req.query.id){
        Productdb.findById(req.query.id)
            .populate('marca')
            .populate('categoria')
            .populate({
                path: 'proveedor',
                match: { _id: { $exists: true } }
            })
            .then(data => res.send(data))
            .catch(err => {
                console.error("ERROR EN FIND:", err);
                res.status(500).send(err);
            })
    }else{
        Productdb.find()
            .populate('marca')
            .populate('categoria')
            .populate('proveedor')
            .then(data => res.send(data))
            .catch(err => res.status(500).send(err))
    }
}

// update
exports.update = (req,res)=>{
    Productdb.findByIdAndUpdate(req.params.id, req.body)
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err))
}

// delete
exports.delete = (req,res)=>{
    Productdb.findByIdAndDelete(req.params.id)
        .then(data => res.send({ message : "Producto eliminado"}))
        .catch(err => res.status(500).send(err))
}
