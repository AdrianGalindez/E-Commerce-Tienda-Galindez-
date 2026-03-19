// =====================
// IMPORTS & CONFIG
// =====================
const axios = require('axios');

const API = 'http://localhost:3000/api';

// Helper para manejar errores
const handleError = (res, err) => {
    console.error(err);
    res.status(500).send('Error en el servidor');
};

// Helper para obtener datos
const fetchData = async (url) => {
    const response = await axios.get(url);
    return response.data;
};


// =====================
// USERS
// =====================

// Página principal
exports.homeRoutes = async (req, res) => {
    try {
        const users = await fetchData(`${API}/users`);
        res.render('index', { users });
    } catch (err) {
        handleError(res, err);
    }
};

// Formulario crear usuario
exports.add_user = (req, res) => {
    res.render('add_user');
};

// Actualizar usuario
exports.update_user = async (req, res) => {
    try {
        const user = await fetchData(`${API}/users?id=${req.query.id}`);
        res.render('update_user', { user });
    } catch (err) {
        handleError(res, err);
    }
};


// =====================
// PRODUCTOS / CATEGORÍAS
// =====================

// Función genérica para filtrar por categoría
const renderByCategoria = async (res, view, categoriaNombre) => {
    try {
        const productos = await fetchData(`${API}/productos`);

        const filtrados = productos.filter(p =>
            p.categoria?.nombre === categoriaNombre
        );

        res.render(view, { productos: filtrados });

    } catch (err) {
        handleError(res, err);
    }
};

// Rutas específicas (usan la función genérica)
exports.bebidas = (req, res) => renderByCategoria(res, 'bebidas', 'Bebidas');
exports.papeleria = (req, res) => renderByCategoria(res, 'papeleria', 'Papelería y miscelania');
exports.aseo = (req, res) => renderByCategoria(res, 'aseo', 'Productos de aseo');
exports.verduras = (req, res) => renderByCategoria(res, 'verduras', 'Verduras Frutas y vegetales');
exports.medicina = (req, res) => renderByCategoria(res, 'medicina', 'Medicina');
exports.otros = (req, res) => renderByCategoria(res, 'otros', 'Otros');

// Ruta dinámica
exports.categoria = async (req, res) => {
    try {
        await renderByCategoria(res, 'categoria', req.params.nombre);
    } catch (err) {
        handleError(res, err);
    }
};


// =====================
// MARCAS
// =====================
exports.marcas = async (req, res) => {
    try {
        const marcas = await fetchData(`${API}/marcas`);
        res.render('marcas', { marcas });
    } catch (err) {
        handleError(res, err);
    }
};


// =====================
// PROMOCIONES
// =====================
exports.promociones = async (req, res) => {
    try {
        const productos = await fetchData(`${API}/productos`);

        const filtrados = productos.filter(p => p.stock > 20);

        res.render('promociones', { productos: filtrados });
    } catch (err) {
        handleError(res, err);
    }
};


// =====================
// CARRITO
// =====================
exports.carrito = (req, res) => {
    res.render('carrito');
};


// =====================
// ADMIN - CREACIÓN
// =====================

exports.create_categoria = (req, res) => res.render('create_categoria');
exports.create_marca = (req, res) => res.render('create_marca');
exports.create_proveedor = (req, res) => res.render('create_proveedor');
exports.create_rol = (req, res) => res.render('create_rol');

// Crear producto (con dependencias)
exports.create_producto = async (req, res) => {
    try {
        const [categorias, marcas] = await Promise.all([
            fetchData(`${API}/categorias`),
            fetchData(`${API}/marcas`)
        ]);

        res.render('create_producto', { categorias, marcas });

    } catch (err) {
        handleError(res, err);
    }
};


// =====================
// VENTAS (ADMIN)
// =====================
exports.ventas = async (req, res) => {
    try {
        const ventas = await fetchData(`${API}/ventas`);
        res.render('ventas', { ventas });
    } catch (err) {
        console.error("Error al obtener ventas:", err);
        res.status(500).send("Error al cargar las ventas");
    }
};
