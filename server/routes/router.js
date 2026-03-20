const express = require('express');
const route = express.Router()

const services = require('../services/render');

// controladores de la aplicación
const userController = require('../controller/user_controller');
const productController = require('../controller/product_controller');
const categoryController = require('../controller/category_controller');
const brandController = require('../controller/brand_controller');
const saleController = require('../controller/sale_controller');
const providerController = require('../controller/provider_controller');
const rolController = require('../controller/rol_controller');
const detailSalesController = require('../controller/detailSales_controller');

// rutas del cliente
route.get('/', services.homeRoutes);
route.get('/promociones', services.promociones);
route.get('/marcas', services.marcas);
route.get('/carrito', services.carrito);
route.get('/categoria/:nombre', services.categoria); // ruta de catergorias dinamica 



//=======================API USERS====================
route.post('/api/users', userController.create);
route.get('/api/users', userController.find);
route.put('/api/users/:id', userController.update);
route.delete('/api/users/:id', userController.delete);


//========================API PRODUCTOS=================
route.post('/api/productos', productController.create);
route.get('/api/productos', productController.find);
route.put('/api/productos/:id', productController.update);
route.delete('/api/productos/:id', productController.delete);


//========================API CATEGORIAS=================
route.post('/api/categorias', categoryController.create);
route.get('/api/categorias', categoryController.find);
route.put('/api/categorias/:id', categoryController.update);
route.delete('/api/categorias/:id', categoryController.delete);


//========================API MARCAS=================
route.post('/api/marcas', brandController.create);
route.get('/api/marcas', brandController.find);
route.put('/api/marcas/:id', brandController.update);
route.delete('/api/marcas/:id', brandController.delete);


//========================API PROVEEDOR=================
route.post('/api/proveedores', providerController.create);
route.get('/api/proveedores', providerController.find);
route.put('/api/proveedores/:id', providerController.update);
route.delete('/api/proveedores/:id', providerController.delete);


//========================API VENTA=================
route.post('/api/ventas', saleController.create);
route.get('/api/ventas', saleController.find);
route.delete('/api/ventas/:id', saleController.delete);


//========================API ROLES=================
route.post('/api/roles', rolController.create);
route.get('/api/roles', rolController.find);
route.put('/api/roles/:id', rolController.update);
route.delete('/api/roles/:id', rolController.delete);

// ======================== API DETALLE VENTAS =====================
route.post('/api/detalle-ventas', detailSalesController.create);
route.get('/api/detalle-ventas', detailSalesController.find);
route.put('/api/detalle-ventas/:id', detailSalesController.update);
route.delete('/api/detalle-ventas/:id', detailSalesController.delete);


//========================Rutas del admin=================
route.get('/create-categoria', services.create_categoria);
route.get('/create-marca', services.create_marca);
route.get('/create-producto', services.create_producto);
route.get('/create-proveedor', services.create_proveedor);
route.get('/create-rol', services.create_rol);
route.get('/admin/ventas', services.ventas);
route.get('/add-user', services.add_user);
route.get('/update-user', services.update_user);

module.exports = route;
