const express = require('express');
const route = express.Router()
const services = require('../services/render');
const upload = require('../middleware/upload'); 

// controladores de la aplicación
const userController = require('../controller/user_controller');
const productController = require('../controller/product_controller');
const categoryController = require('../controller/category_controller');
const brandController = require('../controller/brand_controller');
const checkoutController = require('../controller/checkout_controller');
const saleController = require('../controller/sale_controller');
const providerController = require('../controller/provider_controller');
const rolController = require('../controller/rol_controller');
const detailSalesController = require('../controller/detailSales_controller');
const reviewController = require('../controller/reviewController');
const authController = require('../controller/auth_controller');
const { isAdmin } = require('../middleware/auth');

// rutas del cliente
//=======================API USERS====================
route.post('/api/users', userController.create);
route.get('/api/users', userController.find);
route.get('/api/users/:id', userController.find);
route.put('/api/users/:id', userController.update);
route.delete('/api/users/:id', userController.delete);
route.get('/update-user/:id', services.update_user);
route.post('/update-user/:id', services.update_user_data);

// ========================API AUTH====================
route.post('/login', authController.login);
route.get('/login', services.login);
route.get('/logout', authController.logout);

//========================API PRODUCTOS=================
route.post('/api/productos', upload.array('fotos', 4), productController.create);
route.get('/api/productos', productController.find);
route.put('/api/productos/:id', upload.array('fotos', 4), productController.update);
route.delete('/api/productos/:id', productController.delete);

//========================API CATEGORIAS=================
route.post('/api/categorias', categoryController.create);
route.get('/api/categorias', categoryController.find);
route.get('/api/categorias/:id', categoryController.find);
route.put('/api/categorias/:id', categoryController.update);
route.delete('/api/categorias/:id', categoryController.delete);
route.post('/update-categoria/:id', services.update_category_data);

//========================API MARCAS=================
route.post('/api/marcas', upload.single('foto'), brandController.create);
route.get('/api/marcas', brandController.find);
route.put('/api/marcas/:id', upload.single('foto'), brandController.update);
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

//=========================API REVIEWS=================
route.post('/api/reviews', upload.fields([
 { name: 'fotos', maxCount: 5 },
 { name: 'video', maxCount: 1 }
]), reviewController.create);


// ========================== API REVIEWS =====================
route.get('/api/reviews', reviewController.find);
route.put('/api/reviews/:id', reviewController.update);
route.delete('/api/reviews/:id', reviewController.delete);


// rutas para consumir las apis desde el cliente
route.get('/', services.homeRoutes);
route.get('/promociones', services.promotions);
route.get('/marcas', services.brands);

//==========================CARRITO Y CHECKOUT=================
route.post('/checkout', checkoutController.checkout);
route.get('/checkout/confirmacion/:id', checkoutController.confirmacion);
route.get('/carrito', checkoutController.car);
route.post('/carrito', checkoutController.car);
route.post('/carrito/actualizar', checkoutController.update_carrito);
route.post('/carrito/eliminar', checkoutController.remove_from_carrito);
route.post('/add-to-carrito', checkoutController.add_to_carrito);
route.post('/remove-from-carrito', checkoutController.remove_from_carrito);

//========================Rutas del admin=================
route.get('/categoria/:nombre', services.category); // ruta de catergorias dinamica 
route.get('/create-categoria',isAdmin, services.create_category_form);
route.post('/create-categoria',isAdmin, services.create_category);
route.get('/read-categoria',isAdmin, services.read_categories);
route.post('/read-categoria',isAdmin, services.read_categories);
route.get('/update-categoria',isAdmin, services.update_category);
route.post('/update-categoria',isAdmin, services.update_category);
route.get('/delete-categoria/:id', isAdmin, services.delete_category);
route.get('/brand/:marca', services.Productbrands);

//=======================MARCAS========================
route.get('/create-marca', isAdmin, services.create_brand_form);
route.post('/create-marca', isAdmin, services.create_brand);
route.get('/read-marca', isAdmin, services.read_brands);
route.get('/update-marca', isAdmin, brandController.getBrandForEdit);
route.post('/update-marca/:id',isAdmin, upload.single('foto'), brandController.update); // guarda cambios
route.get('/delete-marca/:id', isAdmin, services.delete_brand);

//=======================PRODUCTOS========================
route.post('/create-producto',isAdmin, services.create_product);
route.get('/read-producto', isAdmin, services.read_products);
route.post('/read-producto', isAdmin, services.read_products);
route.get('/update-producto', isAdmin, services.update_products);
route.post('/update-producto', isAdmin, services.update_products);
route.get('/create-producto', isAdmin, services.create_product_form);
route.get('/delete-producto/:id', isAdmin, services.delete_product);
route.get('/Detalles/:id',  services.product_detail);


// Mostrar formulario de creación
route.get('/create-proveedor', isAdmin, services.create_provider_form);
route.post('/create-proveedor', isAdmin, services.create_provider);
route.get('/read-proveedor', isAdmin, services.read_providers);
route.post('/read-proveedor', isAdmin, services.read_providers);
route.get('/update-proveedor', isAdmin, services.update_provider);
route.post('/update-proveedor', isAdmin, services.update_provider);
route.get('/update-proveedor', isAdmin, services.edit_provider_form);
route.post('/update-proveedor/:id', isAdmin, services.update_provider_data);
route.get('/delete-proveedor/:id', isAdmin, services.delete_provider);

//=======================ROLES========================
route.post('/create-rol', isAdmin, services.create_rol);
route.get('/create-rol', isAdmin, services.create_rol);
route.post('/read-rol', isAdmin, services.read_roles);
route.get('/read-rol', isAdmin, services.read_roles);
route.post('/update-rol', isAdmin, services.update_rol);
route.get('/update-rol', isAdmin, services.update_rol);
route.get('/delete-rol/:id', isAdmin, services.delete_rol);

//=======================VENTAS========================
route.post('/create-ventas', isAdmin, services.sales);
route.get('/create-ventas', isAdmin, services.sales);
route.post('/read-ventas', isAdmin, services.sales);
route.get('/read-ventas', isAdmin, services.sales);
route.post('/update-ventas', isAdmin, services.sales);
route.get('/update-ventas', isAdmin, services.sales);
route.get('/create-ventas-form', isAdmin, services.create_sale_form);
route.get('/create-detalle-venta', isAdmin, services.create_sale_detail_form);

//=======================USUARIOS========================
route.get('/add-user-form', isAdmin, services.create_user_form);
route.get('/add-user', isAdmin, services.add_user);
route.post('/add-user', isAdmin, services.add_user);
route.post('/read-user', isAdmin, services.read_users);
route.get('/read-user', isAdmin, services.read_users);
route.post('/update-user', isAdmin, services.update_user);
route.get('/update-user', isAdmin, services.update_user);
route.get('/delete-user/:id', isAdmin, services.delete_user);



module.exports = route;
