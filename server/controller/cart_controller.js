const Salesdb = require('../model/sales');
const SaleDetaildb = require('../model/SaleDetail');
const Productdb = require('../model/product');
const Cartdb = require('../model/cart');

// ======================= CHECKOUT =======================
exports.checkout = async (req, res) => {
    try {

        const userId = req.session.user?._id;

        if (!userId) {
            return res.redirect('/login');
        }

        const cart = await Cartdb
            .findOne({ usuario: userId })
            .populate('items.producto');

        if (!cart || cart.items.length === 0) {
            return res.status(400).send("El carrito está vacío");
        }

        let total = 0;
        const detalles = [];

        for (let item of cart.items) {

            const productoDB = item.producto;

            // 🔥 VALIDAR STOCK (IMPORTANTE)
            if (productoDB.stock < item.cantidad) {
                return res.status(400).send(`Stock insuficiente para ${productoDB.nombre}`);
            }

            const subtotal = productoDB.precio * item.cantidad;
            total += subtotal;

            detalles.push({
                producto: productoDB._id,
                cantidad: item.cantidad,
                precioUnitario: productoDB.precio,
                subtotal
            });

            // actualizar stock
            productoDB.stock -= item.cantidad;
            await productoDB.save();
        }

        // Crear venta
        const venta = new Salesdb({
            cliente: userId,
            total
        });

        const ventaGuardada = await venta.save();

        // Crear detalles
        for (let d of detalles) {
            await new SaleDetaildb({
                venta: ventaGuardada._id,
                ...d
            }).save();
        }

        // Vaciar carrito
        cart.items = [];
        cart.total = 0;
        await cart.save();

        res.redirect(`/checkout/confirmacion/${ventaGuardada._id}`);

    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};

// ======================= CONFIRMACIÓN =======================
exports.confirmacion = async (req, res) => {
    try {
        const ventaId = req.params.id;

        const venta = await Salesdb
            .findById(ventaId)
            .populate('cliente');

        const detalles = await SaleDetaildb
            .find({ venta: ventaId })
            .populate('producto');

        res.render('checkout_confirmacion', { venta, detalles });

    } catch (err) {
        res.status(500).send(err.message);
    }
};

// ======================= AGREGAR AL CARRITO =======================
exports.add_to_carrito = async (req, res) => {
    try {

        const userId = req.session.user?._id;
        const { productoId, cantidad } = req.body;

        if (!userId) {
            return res.redirect('/login');
        }

        const producto = await Productdb.findById(productoId);
        if (!producto) {
            return res.status(404).send("Producto no encontrado");
        }

        let cart = await Cartdb.findOne({ usuario: userId });

        if (!cart) {
            cart = new Cartdb({
                usuario: userId,
                items: [],
                total: 0
            });
        }

        const cant = parseInt(cantidad) || 1;

        const item = cart.items.find(
            i => i.producto.toString() === productoId
        );

        if (item) {
            item.cantidad += cant;
            item.subtotal = item.cantidad * producto.precio;
        } else {
            cart.items.push({
                producto: productoId,
                cantidad: cant,
                precio: producto.precio,
                subtotal: producto.precio * cant
            });
        }

        cart.total = cart.items.reduce((acc, i) => acc + i.subtotal, 0);

        await cart.save();

        res.redirect('/carrito');

    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};

// ======================= VER CARRITO =======================
exports.car = async (req, res) => {
    try {

        const userId = req.session.user?._id;

        if (!userId) {
            return res.redirect('/login');
        }

        const cart = await Cartdb
            .findOne({ usuario: userId })
            .populate('items.producto');

        const productos = cart ? cart.items : [];
        const subtotal = cart ? cart.total : 0;

        res.render('car', {
            productosCarrito: productos,
            subtotal
        });

    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};

// ======================= ELIMINAR ITEM =======================
exports.remove_from_carrito = async (req, res) => {
    try {

        const userId = req.session.user?._id;
        const { productoId } = req.body;

        const cart = await Cartdb.findOne({ usuario: userId });

        if (!cart) return res.redirect('/carrito');

        cart.items = cart.items.filter(
            i => i.producto.toString() !== productoId
        );

        cart.total = cart.items.reduce((acc, i) => acc + i.subtotal, 0);

        await cart.save();

        res.redirect('/carrito');

    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};

// ======================= ACTUALIZAR CANTIDAD =======================
exports.update_carrito = async (req, res) => {
    try {

        const userId = req.session.user?._id;
        const { productoId, cantidad } = req.body;

        const cart = await Cartdb.findOne({ usuario: userId });

        if (!cart) return res.redirect('/carrito');

        const item = cart.items.find(
            i => i.producto.toString() === productoId
        );

        if (item) {
            const cant = Math.max(1, parseInt(cantidad)); // 🔥 evita 0 o negativos
            item.cantidad = cant;
            item.subtotal = item.cantidad * item.precio;
        }

        cart.total = cart.items.reduce((acc, i) => acc + i.subtotal, 0);

        await cart.save();

        res.redirect('/carrito');

    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};