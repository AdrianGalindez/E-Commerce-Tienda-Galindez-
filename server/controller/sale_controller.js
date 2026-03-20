var Ventadb = require('../model/venta');

exports.create = (req,res)=>{
    const venta = new Ventadb({
        total : req.body.total
    });

    venta.save()
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err))
}

exports.find = (req,res)=>{
    Ventadb.find()
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err))
}

exports.delete = (req,res)=>{
    Ventadb.findByIdAndDelete(req.params.id)
        .then(data => res.send({ message : "Venta eliminada"}))
        .catch(err => res.status(500).send(err))
}
