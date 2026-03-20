var Marcadb = require('../model/marca');

exports.create = (req,res)=>{
    const marca = new Marcadb({
        nombre : req.body.nombre
    });

    marca.save()
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err))
}

exports.find = (req,res)=>{
    Marcadb.find()
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err))
}

exports.update = (req,res)=>{
    Marcadb.findByIdAndUpdate(req.params.id, req.body)
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err))
}

exports.delete = (req,res)=>{
    Marcadb.findByIdAndDelete(req.params.id)
        .then(data => res.send({ message : "Marca eliminada"}))
        .catch(err => res.status(500).send(err))
}
