const express = require('express');
const route = express.Router()

const services = require('../services/render');
const controller = require('../controller/controller');

// controladores de la aplicación
const userController = require('../controller/user_controller');
const productoController = require('../controller/producto_controller');
const categoriaController = require('../controller/categoria_controller');
const marcaController = require('../controller/marca_controller');
const ventaController = require('../controller/venta_controller');
const proveedorController = require('../controller/proveedor_controller');
/**
 *  @description Root Route
 *  @method GET /
 */
route.get('/', services.homeRoutes);

/**
 *  @description add users
 *  @method GET /add-user
 */

route.get('/add-user', services.add_user)
route.get('/promociones', services.promociones)
route.get('/marcas', services.marcas)
route.get('/bebidas', services.bebidas)
route.get('/papeleria', services.papeleria)
route.get('/aseo', services.aseo)
route.get('/verduras', services.verduras)
route.get('/medicina', services.medicina)
route.get('/otros', services.otros)
route.get('/carrito', services.carrito)
route.get('/categoria/:nombre', services.categoria)

/**
 *  @description for update user
 *  @method GET /update-user
 */
route.get('/update-user', services.update_user)


// =====================
// API USERS
// =====================

route.post('/api/users', userController.create);
route.get('/api/users', userController.find);
route.put('/api/users/:id', userController.update);
route.delete('/api/users/:id', userController.delete);


// =====================
// API PRODUCTOS
// =====================

route.post('/api/productos', productoController.create);
route.get('/api/productos', productoController.find);
route.put('/api/productos/:id', productoController.update);
route.delete('/api/productos/:id', productoController.delete);


// =====================
// API CATEGORIAS
// =====================

route.post('/api/categorias', categoriaController.create);
route.get('/api/categorias', categoriaController.find);
route.put('/api/categorias/:id', categoriaController.update);
route.delete('/api/categorias/:id', categoriaController.delete);


// =====================
// API MARCAS
// =====================

route.post('/api/marcas', marcaController.create);
route.get('/api/marcas', marcaController.find);
route.put('/api/marcas/:id', marcaController.update);
route.delete('/api/marcas/:id', marcaController.delete);


// =====================
// API PROVEEDORES
// =====================

route.post('/api/proveedores', proveedorController.create);
route.get('/api/proveedores', proveedorController.find);
route.put('/api/proveedores/:id', proveedorController.update);
route.delete('/api/proveedores/:id', proveedorController.delete);


// =====================
// API VENTAS
// =====================

route.post('/api/ventas', ventaController.create);
route.get('/api/ventas', ventaController.find);
route.delete('/api/ventas/:id', ventaController.delete);


// =====================
// RUTAS PARA FORMULARIOS DE CREACIÓN (ADMIN)
// =====================
route.get('/create-categoria', services.create_categoria);
route.get('/create-marca', services.create_marca);
route.get('/create-producto', services.create_producto);
route.get('/create-proveedor', services.create_proveedor);
route.get('/create-rol', services.create_rol);
route.get('/admin/ventas', services.ventas);

module.exports = route