var DetalleVentadb = require('../model/saleDetail');

// =======================
// CREATE
// =======================
exports.create = (req, res) => {

    const detalle = new DetalleVentadb({
        venta: req.body.venta,
        producto: req.body.producto,
        cantidad: req.body.cantidad,
        precioUnitario: req.body.precioUnitario
    });

    detalle.save()
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err));
}


// =======================
// FIND
// =======================
exports.find = (req, res) => {

    DetalleVentadb.find()
        .populate('venta')
        .populate('producto')
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err));
}


// =======================
// UPDATE
// =======================
exports.update = (req, res) => {

    DetalleVentadb.findByIdAndUpdate(req.params.id, req.body)
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err));
}


// =======================
// DELETE
// =======================
exports.delete = (req, res) => {

    DetalleVentadb.findByIdAndDelete(req.params.id)
        .then(data => res.send({ message: "Detalle de venta eliminado" }))
        .catch(err => res.status(500).send(err));
}
