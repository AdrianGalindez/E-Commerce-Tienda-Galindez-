var Categorydb = require('../model/categoria');

exports.create = (req,res)=>{
    const Categorydb = new Categoriadb({
        nombre : req.body.nombre
    });

    Categorydb.save()
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err))
}

exports.find = (req,res)=>{
    Categorydb.find()
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err))
}

exports.update = (req,res)=>{
    Categorydb.findByIdAndUpdate(req.params.id, req.body)
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err))
}

exports.delete = (req,res)=>{
    Categorydb.findByIdAndDelete(req.params.id)
        .then(data => res.send({ message : "Categoria eliminada"}))
        .catch(err => res.status(500).send(err))
}
