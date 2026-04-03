const Cartdb = require('../model/cart');

// 🛒 Mostrar carrito
exports.car = async (req, res) => {
    try {

        const userId = req.session.user?._id;

        if (!userId) {
            return res.redirect('/login');
        }

        const cart = await Cartdb
            .findOne({ usuario: userId })
            .populate('items.producto');

        const productosCarrito = cart ? cart.items : [];

        const subtotal = cart
            ? cart.items.reduce((sum, item) => sum + item.subtotal, 0)
            : 0;

        res.render('car', {
            productosCarrito,
            subtotal
        });

    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};

// ➕ Agregar al carrito
exports.add_to_carrito = async (req, res) => {
    try {

        const userId = req.session.user?._id;
        const { productoId, cantidad } = req.body;

        if (!userId) {
            return res.redirect('/login');
        }

        const Productdb = require('../model/product');
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

        const item = cart.items.find(
            i => i.producto.toString() === productoId
        );

        const cant = parseInt(cantidad) || 1;

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