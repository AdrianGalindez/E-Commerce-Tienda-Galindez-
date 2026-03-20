var Proveedordb = require('../model/proveedor');


// =======================
// CREATE
// =======================

exports.create = (req,res)=>{
    if(!req.body){
        return res.status(400).send({ message : "Content can not be empty!"});
    }

    const proveedor = new Proveedordb({
        nombre : req.body.nombre,
        telefono : req.body.telefono,
        direccion : req.body.direccion
    });

    proveedor
        .save()
        .then(data => {
            res.send(data);
        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Error creating proveedor"
            });
        });
}


// =======================
// FIND
// =======================

exports.find = (req, res)=>{

    if(req.query.id){
        const id = req.query.id;

        Proveedordb.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Proveedor no encontrado con id "+ id})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Error retrieving proveedor with id " + id})
            })

    }else{
        Proveedordb.find()
            .then(proveedor => {
                res.send(proveedor)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error retrieving proveedores" })
            })
    }
}


// =======================
// UPDATE
// =======================

exports.update = (req, res)=>{
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const id = req.params.id;

    Proveedordb.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update proveedor with ${id}. Maybe not found!`})
            }else{
                res.send(data)
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error updating proveedor information"})
        })
}


// =======================
// DELETE
// =======================

exports.delete = (req, res)=>{
    const id = req.params.id;

    Proveedordb.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete proveedor with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "Proveedor was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete proveedor with id=" + id
            });
        });
}
