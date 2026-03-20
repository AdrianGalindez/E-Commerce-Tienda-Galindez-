var Categoriadb = require('../model/categoria');

exports.create = (req,res)=>{
    const categoria = new Categoriadb({
        nombre : req.body.nombre
    });

    categoria.save()
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err))
}

exports.find = (req,res)=>{
    Categoriadb.find()
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err))
}

exports.update = (req,res)=>{
    Categoriadb.findByIdAndUpdate(req.params.id, req.body)
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err))
}

exports.delete = (req,res)=>{
    Categoriadb.findByIdAndDelete(req.params.id)
        .then(data => res.send({ message : "Categoria eliminada"}))
        .catch(err => res.status(500).send(err))
}
