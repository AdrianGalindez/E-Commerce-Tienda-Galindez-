var SaleDetaildb = require('../model/saleDetail');

// =======================
// CREATE
// =======================
exports.create = (req, res) => {

    const detail = new SaleDetaildb({
        venta: req.body.venta,
        producto: req.body.producto,
        cantidad: req.body.cantidad,
        precioUnitario: req.body.precioUnitario
    });

    detail.save()
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err));
}


// =======================
// FIND
// =======================
exports.find = (req, res) => {

    SaleDetaildb.find()
        .populate('venta')
        .populate('producto')
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err));
}


// =======================
// UPDATE
// =======================
exports.update = (req, res) => {

    SaleDetaildb.findByIdAndUpdate(req.params.id, req.body)
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
