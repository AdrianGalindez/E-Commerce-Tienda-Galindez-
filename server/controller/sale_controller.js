const Saledb = require('../model/sales');
const SaleDetaildb = require('../model/saleDetails');
const Productdb = require('../model/product');

exports.create = async (req, res) => {
    try {
        const { cliente, productos } = req.body;
        if (!cliente || !productos || productos.length === 0) {
            return res.status(400).send({ message: "Datos incompletos" });
        }
        let total = 0;
        const detalles = [];
        for (let item of productos) {
            const productoDB = await Productdb.findById(item.producto);
            if (!productoDB) {
                return res.status(404).send({ message: "Producto no encontrado" });
            }
            if (productoDB.stock < item.cantidad) {
                return res.status(400).send({
                    message: `Stock insuficiente para ${productoDB.nombre}`
                });
            }
            const subtotal = productoDB.precio * item.cantidad;
            total += subtotal;
            detalles.push({
                producto: item.producto,
                cantidad: item.cantidad,
                precioUnitario: productoDB.precio,
                subtotal: subtotal
            });
            // ACTUALIZAR STOCK
            productoDB.stock -= item.cantidad;
            await productoDB.save();
        }
        // Crear venta
        const venta = new Saledb({
            cliente,
            total
        });
        const ventaGuardada = await venta.save();
        // 🛡️ VALIDACIÓN NUEVA (EVITA TU ERROR ACTUAL)
        if (!ventaGuardada || !ventaGuardada._id) {
            return res.status(500).send({
                message: "Error: la venta no se pudo crear correctamente"
            });
        }
        // Guardar detalles
        for (let d of detalles) {
            await SaleDetaildb.create({
                venta: ventaGuardada._id,
                producto: d.producto,
                cantidad: d.cantidad,
                precioUnitario: d.precioUnitario,
                subtotal: d.subtotal
            });
        }
        res.status(201).send({
            message: "Venta realizada correctamente",
            venta: ventaGuardada
        });

    } catch (err) {
        res.status(500).send({
            message: "Error al procesar la venta",
            error: err
        });
    }
};



exports.find = async (req, res) => {
    try {
        const ventas = await Saledb.find()
            .populate("cliente")
            .lean();
        for (let venta of ventas) {
            venta.detalles = await SaleDetaildb.find({ venta: venta._id })
                .populate("producto");
        }
        res.send(ventas);
    } catch (err) {
        res.status(500).send(err);
    }
};



exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        // 🛡️ VALIDACIÓN NUEVA
        if (!id) {
            return res.status(400).send({
                message: "ID de venta no proporcionado"
            });
        }
        const venta = await Saledb.findById(id);

        if (!venta) {
            return res.status(404).send({
                message: "Venta no encontrada"
            });
        }
        // buscar detalles de la venta
        const detalles = await SaleDetaildb.find({ venta: id });
        // devolver stock a los productos
        for (let d of detalles) {
            const producto = await Productdb.findById(d.producto);
            if (producto) {
                producto.stock += d.cantidad;
                await producto.save();
            }
        }

        // eliminar detalles
        await SaleDetaildb.deleteMany({ venta: id });
        // eliminar venta
        await Saledb.findByIdAndDelete(id);
        res.send({
            message: "Venta eliminada correctamente"
        });
    } catch (error) {
        res.status(500).send({
            message: "Error eliminando la venta",
            error: error
        });
    }
};