var Brand_db = require('../model/marca');

exports.create = (req,res)=>{
    const marca = new Brand_db({
        nombre : req.body.nombre
    });

    Brand_db.save()
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err))
}

exports.find = (req,res)=>{
    Brand_db.find()
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err))
}

exports.update = (req,res)=>{
    Brand_db.findByIdAndUpdate(req.params.id, req.body)
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err))
}

exports.delete = (req,res)=>{
    Brand_db.findByIdAndDelete(req.params.id)
        .then(data => res.send({ message : "Marca eliminada"}))
        .catch(err => res.status(500).send(err))
}
