var Saledb = require('../model/venta');

exports.create = (req,res)=>{
    const Sale = new Saledb({
        total : req.body.total
    });

    Sale.save()
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err))
}

exports.find = (req,res)=>{
    Saledb.find()
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err))
}

exports.delete = (req,res)=>{
    Saledb.findByIdAndDelete(req.params.id)
        .then(data => res.send({ message : "Venta eliminada"}))
        .catch(err => res.status(500).send(err))
}
