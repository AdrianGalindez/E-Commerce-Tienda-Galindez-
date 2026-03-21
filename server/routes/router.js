const express = require('express');
const route = express.Router()
const services = require('../services/render');
console.log(services);


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


// rutas para consumir las apis desde el cliente
route.get('/', services.homeRoutes);
route.get('/promociones', services.promotions);
route.get('/marcas', services.brands);
route.get('/carrito', services.car);
route.get('/categoria/:nombre', services.category); // ruta de catergorias dinamica 


//========================Rutas del admin=================
route.get('/create-categoria', services.create_category_form);
route.post('/create-categoria', services.create_category);
route.get('/read-categoria', services.read_categories);
route.post('/read-categoria', services.read_categories);
route.get('/update-categoria', services.read_categories);
route.post('/update-categoria', services.read_categories);


route.get('/create-marca', services.create_brand_form);
route.post('/create-marca', services.create_brand);
route.get('/read-marca', services.read_brands);
route.get('/update-marca', services.update_brand);
route.post('/update-marca', services.update_brand);


// route.get('/create-product', services.create_product_form);
route.post('/create-producto', services.create_product);
route.get('/read-producto', services.read_products);
route.post('/read-producto', services.read_products);
route.get('/update-producto', services.read_products);
route.post('/update-producto', services.read_products);
route.get('/create-producto', services.create_product_form);


// Mostrar formulario de creación
route.get('/create-proveedor', services.create_provider_form);
route.post('/create-proveedor', services.create_provider);
route.get('/read-proveedor', services.read_providers);
route.post('/read-proveedor', services.read_providers);
route.get('/update-proveedor', services.update_provider);
route.post('/update-proveedor', services.update_provider);


route.post('/create-rol', services.create_rol);
route.get('/create-rol', services.create_rol);
route.post('/read-rol', services.read_roles);
route.get('/read-rol', services.read_roles);
route.post('/update-rol', services.read_roles);
route.get('/update-rol', services.read_roles);


route.post('/create-ventas', services.sales);
route.get('/create-ventas', services.sales);
route.post('/read-ventas', services.sales);
route.get('/read-ventas', services.sales);
route.post('/update-ventas', services.sales);
route.get('/update-ventas', services.sales);
route.get('/create-ventas-form', services.create_sale_form);
route.get('/create-detalle-venta', services.create_sale_detail_form);


route.post('/add-user', services.add_user);
route.get('/add-user', services.add_user);
route.post('/read-user', services.read_users);
route.get('/read-user', services.read_users);
route.post('/update-user', services.update_user);
route.get('/update-user', services.update_user);


module.exports = route;
