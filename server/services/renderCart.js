const axios = require('axios');


// Carrito
exports.car = async (req, res) => {
    try {
        // Si no hay carrito, enviamos un arreglo vacío
        const carrito = req.session.carrito || [];

        // Traemos todos los productos desde la API
        const response = await axios.get('http://localhost:3000/api/productos');
        const productosTodos = response.data;

        // Unir carrito con datos completos de productos
        const productosCarrito = carrito.map(item => {
            const producto = productosTodos.find(p => p._id === item.productoId);
            return {
                ...producto,
                cantidad: item.cantidad
            };
        });

        // Calcular subtotal
        const subtotal = productosCarrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

        res.render('car', { productosCarrito, subtotal });
    } catch (err) {
        console.error(err);
        res.send(err.message);
    }
};

exports.add_to_carrito = (req, res) => {
    const productoId = req.body.productoId;
    const cantidad = Number(req.body.cantidad) || 1;

    if (!req.session.carrito) req.session.carrito = [];

    const index = req.session.carrito.findIndex(p => p.productoId === productoId);
    if (index >= 0) {
        req.session.carrito[index].cantidad += cantidad;
    } else {
        req.session.carrito.push({ productoId, cantidad });
    }

    res.redirect('/carrito');
};