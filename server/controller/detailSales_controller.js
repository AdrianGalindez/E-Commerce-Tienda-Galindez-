const SaleDetaildb = require('../model/saleDetails');

// CREATE
exports.create = async (req, res) => {

    try {

        const subtotal = req.body.cantidad * req.body.precioUnitario

        const detail = new SaleDetaildb({
            venta: req.body.venta,
            producto: req.body.producto,
            cantidad: req.body.cantidad,
            precioUnitario: req.body.precioUnitario,
            subtotal: subtotal
        });

        const data = await detail.save()

        res.send(data)

    } catch (error) {

        res.status(500).send(error)

    }
}


// FIND
exports.find = async (req, res) => {

    try {

        const ventaId = req.query.venta

        const data = await SaleDetaildb.find({ venta: ventaId })
            .populate('producto')
            .populate('venta')

        res.send(data)

    } catch (error) {

        res.status(500).send(error)

    }
}


// UPDATE
exports.update = async (req, res) => {

    try {

        const subtotal = req.body.cantidad * req.body.precioUnitario

        const data = await SaleDetaildb.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                subtotal: subtotal
            },
            { new: true }
        )

        res.send(data)

    } catch (error) {

        res.status(500).send(error)

    }
}


// DELETE

exports.delete = async (req, res) => {

    try {

        const data = await SaleDetaildb.findByIdAndDelete(req.params.id)

        if (!data) {
            return res.status(404).send({
                message: "Detalle no encontrado"
            })
        }

        res.send({
            message: "Detalle de venta eliminado"
        })

    } catch (error) {

        res.status(500).send(error)

    }
}