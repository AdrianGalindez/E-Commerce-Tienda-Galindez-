const Salesdb = require('../model/sales');
const SaleDetaildb = require('../model/saleDetails');
const Productdb = require('../model/product');



function getCart(req) {
    if (!req.session.cart) {
        req.session.cart = {
            items: [],
            total: 0
        };
    }

    // seguridad básica
    if (!Array.isArray(req.session.cart.items)) {
        req.session.cart.items = [];
    }

    if (typeof req.session.cart.total !== "number") {
        req.session.cart.total = 0;
    }

    return req.session.cart;
}
// ======================= CHECKOUT =======================
exports.checkout = async (req, res) => {
    try {

        const userId = req.session.user?._id;

        if (!userId) return res.redirect('/login');

        const cart = req.session.cart;

        if (!cart?.items?.length) {
            return res.status(400).send("Carrito vacío");
        }

        let total = 0;
        const detalles = [];

        for (const item of cart.items) {

            if (!item.productoId) {
                return res.status(400).send("Producto inválido en carrito");
            }

            const productoDB = await Productdb.findById(item.productoId);

            if (!productoDB) {
                return res.status(404).send("Producto no encontrado");
            }

            const cantidad = Number(item.cantidad);

            if (productoDB.stock < cantidad) {
                return res.status(400).send(`Stock insuficiente para ${productoDB.nombre}`);
            }

            const subtotal = productoDB.precio * cantidad;
            total += subtotal;

            detalles.push({
                producto: productoDB._id,
                cantidad,
                precioUnitario: productoDB.precio,
                subtotal
            });

            productoDB.stock -= cantidad;
            await productoDB.save();
        }

        const venta = new Salesdb({
            cliente: userId,
            total
        });

        const ventaGuardada = await venta.save();

        if (!ventaGuardada?._id) {
            return res.status(500).send("No se pudo crear la venta");
        }

        for (const d of detalles) {
            await SaleDetaildb.create({
                venta: ventaGuardada._id,
                ...d
            });
        }

        req.session.cart = { items: [], total: 0 };

        return res.redirect(`/checkout/confirmacion/${ventaGuardada._id}`);

    } catch (err) {
        console.error("CHECKOUT ERROR:", err);
        return res.status(500).send(err.message);
    }
};

// ======================= CONFIRMACIÓN =======================
exports.confirmacion = async (req, res) => {
    try {

        const ventaId = req.params.id;

        if (!ventaId) {
            return res.status(400).send("ID de venta inválido");
        }

        const venta = await Salesdb.findById(ventaId).populate('cliente');

        if (!venta) {
            return res.status(404).send("Venta no encontrada");
        }

        const detalles = await SaleDetaildb.find({ venta: ventaId }).populate('producto');

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

        if (!userId) return res.redirect('/login');

        const producto = await Productdb.findById(productoId);
        if (!producto) {
            return res.status(404).send("Producto no encontrado");
        }

        const cart = getCart(req);
        const cant = parseInt(cantidad) || 1;

        const item = cart.items.find(
            i => i.productoId === productoId
        );

        if (item) {
            item.cantidad += cant;
            item.subtotal = item.cantidad * item.precio;
        } else {
            cart.items.push({
                productoId: producto._id.toString(),
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: cant,
                subtotal: producto.precio * cant,
                foto: producto.foto
            });
        }

        cart.total = cart.items.reduce((acc, i) => acc + i.subtotal, 0);

        req.session.cart = cart;

        res.redirect('/carrito');

    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};

// ======================= VER CARRITO =======================
exports.car = async (req, res) => {
    try {

        const cart = req.session.cart || {
            items: [],
            total: 0
        };

        res.render('client/cart/cart', {
            productosCarrito: cart.items,
            subtotal: cart.total
        });

    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};

// ======================= ELIMINAR ITEM =======================
exports.remove_from_carrito = (req, res) => {
    try {

        const { productoId } = req.body;
        const cart = getCart(req);

        cart.items = cart.items.filter(
            i => i.productoId !== productoId
        );

        cart.total = cart.items.reduce((acc, i) => acc + i.subtotal, 0);

        req.session.cart = cart;

        res.redirect('/carrito');

    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};

// ======================= ACTUALIZAR CANTIDAD =======================
exports.update_carrito = async (req, res) => {
    try {

        const { productoId, cantidad } = req.body;
        const cart = getCart(req);

        const item = cart.items.find(i => i.productoId === productoId);

        if (item) {
            const cant = Math.max(1, parseInt(cantidad));
            item.cantidad = cant;
            const producto = await Productdb.findById(item.productoId);
            item.subtotal = producto.precio * cant;
        }

        cart.total = cart.items.reduce((acc, i) => acc + i.subtotal, 0);

        req.session.cart = cart;

        res.redirect('/carrito');

    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};





// ======================= MOSTRAR CHECKOUT =======================
exports.payment_point = async (req, res) => {
    try {
        const userId = req.session.user?._id;

        if (!userId) {
            return res.redirect('/login');
        }

        const cart = req.session.cart;
        
        if (!cart || cart.items.length === 0) {
            return res.status(400).send("El carrito está vacío");
        }
        console.log("CART EN CHECKOUT:", cart);

        res.render('payment_point', {
            user: req.session.user,
            cart: cart || { items: [], total: 0 }
        });

    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};