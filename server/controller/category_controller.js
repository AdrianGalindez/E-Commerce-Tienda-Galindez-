const Categorydb = require('../model/categories');

// CREATE

exports.create = async (req, res) => {

    try {
        if (!req.body.nombre) {
            return res.status(400).json({
                message: "El nombre es obligatorio"
            });
        }

        // VALIDACIÓN DE DUPLICADO 
        const existe = await Categorydb.findOne({ nombre: req.body.nombre });

        if (existe) {
            return res.status(400).json({
                message: "La categoría ya existe"
            });
        }

        const category = new Categorydb({
            nombre: req.body.nombre
        });

        const data = await category.save();

        res.status(201).json(data);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};


// FIND
exports.find = (req, res) => {
    Categorydb.find()
        .then(data => res.json(data))
        .catch(err => res.status(500).json({
            message: err.message
        }));
};


// UPDATE
exports.update = (req, res) => {

    if (!req.params.id) {
        return res.status(400).json({
            message: "ID requerido"
        });
    }

    Categorydb.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(data => res.json(data))
        .catch(err => res.status(500).json({
            message: err.message
        }));
};


// DELETE
exports.delete = (req, res) => {

    if (!req.params.id) {
        return res.status(400).json({
            message: "ID requerido"
        });
    }

    Categorydb.findByIdAndDelete(req.params.id)
        .then(() => res.json({
            message: "Categoría eliminada"
        }))
        .catch(err => res.status(500).json({
            message: err.message
        }));
};