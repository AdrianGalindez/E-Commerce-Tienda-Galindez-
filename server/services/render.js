const axios = require('axios');


// ==================== CLIENTES =========================

// Página principal
exports.homeRoutes = (req, res) => {
    axios.get('http://localhost:3000/api/productos')
        .then(response => {
            console.log("HOME read productos:", response.data);
            res.render('index', { productos: response.data });
        })
        .catch(err => res.send(err));
};


// // Categoría dinámica
// exports.category = (req, res) => {
//     axios.get('http://localhost:3000/api/productos')
//         .then(response => {
//             const productos = response.data.filter(p => 
//                 p.categoria?.nombre === req.params.nombre,
//                 console.log("CATEGORIA:", req.params.nombre)
//             );
//             console.log("CATEGORIA:", req.params.nombre);
//             res.render('categories', { productos });
//         })
//         .catch(err => res.send(err));
// };
exports.category = (req, res) => {
    axios.get('http://localhost:3000/api/productos')
        .then(response => {

            const data = response.data;

            // 1️Filtrar productos
            const productos = data.filter(p => 
                p.categoria?.nombre === req.params.nombre
            );

            // Obtener el primero (para título)
            const categoria = productos.length > 0 
                ? productos[0].categoria 
                : null;

            res.render('categories', { productos, categoria });

        })
        .catch(err => res.send(err));
};

// Promociones
exports.promotions = (req, res) => {
    axios.get('http://localhost:3000/api/productos')
        .then(response => {
            const productos = response.data.filter(p => p.stock > 20);
            res.render('promotions', { productos });
        })
        .catch(err => res.send(err));
};


// Carrito
exports.car = (req, res) => {
    res.render('car');
};


// Marcas (cliente)
exports.brands = (req, res) => {
    axios.get('http://localhost:3000/api/marcas')
        .then(response => {
            res.render('brands', { marcas: response.data });
        })
        .catch(err => res.send(err));
};


// ==================== PRODUCTOS ========================
exports.create_product = (req, res) => {
    axios.post('http://localhost:3000/api/productos', req.body)
        .then(response => {
            console.log("PRODUCTO======================:", req.body);
            res.redirect('/create-producto');
        })
        .catch(err => res.send(err));
};


// Mostrar formulario de creación de producto
exports.create_product_form = (req, res) => {
    // Traemos marcas, categorías y proveedores para los selects del formulario
    Promise.all([
        axios.get('http://localhost:3000/api/marcas'),
        axios.get('http://localhost:3000/api/categorias'),
        axios.get('http://localhost:3000/api/proveedores')
    ])
    .then(([marcasRes, categoriasRes, proveedoresRes]) => {
        console.log("PRODUCTO:", req.body);
        res.render('create_producto', { 
            marcas: marcasRes.data,
            categorias: categoriasRes.data,
            proveedores: proveedoresRes.data
        });
    })
    .catch(err => res.send(err));
};


exports.read_products = (req, res) => {
    axios.get('http://localhost:3000/api/productos')
        .then(response => {
            console.log("read PRODUCTOS:", response.data);
            res.render('read_products', { productos: response.data });
        })
        .catch(err => res.send(err));
};


exports.update_products = (req, res) => {
    axios.get('http://localhost:3000/api/productos', { params: { id: req.query.id }})
        .then(response => {
            res.render('update_products', { productos: response.data });
        })
        .catch(err => res.send(err));
};


exports.delete_product = (req, res) => {
    axios.delete(`http://localhost:3000/api/productos/${req.params.id}`)
        .then(response => {
            res.redirect('read_products');
        })
        .catch(err => res.send(err));
};



// ==================== CATEGORÍAS =======================

exports.create_category_form = (req, res) => {
    res.render('create_categoria'); // formulario simple, solo nombre
};

exports.create_category = (req, res) => {
    console.log("CATEGORIA:", req.body); 
    axios.post('http://localhost:3000/api/categorias', req.body)
        .then(response => {
            console.log("BODY EN SERVICES:", req.body);
            res.redirect('/create-categoria');
        })
        .catch(err => {
            console.log(err);
            res.send(err);
        });
};


exports.read_categories = (req, res) => {
    axios.get('http://localhost:3000/api/categorias')
        .then(response => {
            console.log("CATEGORÍAS:", response.data);
            res.render('read_categories', { categories: response.data });
        })
        .catch(err => res.send(err));
};


exports.update_category = (req, res) => {
    axios.get('http://localhost:3000/api/categorias', { params: { id: req.query.id }})
        .then(response => {
            res.render('update_categoria', { category: response.data });
        })
        .catch(err => res.send(err));
};


// ==================== MARCAS ===========================

exports.create_brand = (req, res) => {
    axios.post('http://localhost:3000/api/marcas', req.body)
        .then(response => {
            console.log("MARCA:", req.body);
            res.redirect('/create-marca');
        })
        .catch(err => {
            console.log(err);
            res.send(err);
        });
};

exports.create_brand_form = (req, res) => {
    res.render('create_marca'); // formulario simple, solo nombre
};


exports.read_brands = (req, res) => {
    axios.get('http://localhost:3000/api/marcas')
        .then(response => {
            res.render('read_brands', { brands: response.data });
        })
        .catch(err => res.send(err));
};


exports.update_brand = (req, res) => {
    axios.get('http://localhost:3000/api/marcas', { params: { id: req.query.id }})
        .then(response => {
            res.render('update_brands', { brand: response.data });
        })
        .catch(err => res.send(err));
};



// ==================== PROVEEDORES ======================
exports.create_provider_form = (req, res) => {
    res.render('create_proveedor');
};

exports.create_provider = (req, res) => {
    axios.post('http://localhost:3000/api/proveedores', req.body)
        .then(response => {
            console.log("PROVEEDOR GUARDADO:", req.body);
            res.redirect('/create-proveedor');
        })
        .catch(err => {
            console.log(err);
            res.send(err);
        });
};


exports.read_providers = (req, res) => {
    axios.get('http://localhost:3000/api/proveedores')
        .then(response => {
            res.render('read_providers', { providers: response.data });
        })
        .catch(err => res.send(err));
};


exports.update_provider = (req, res) => {
    axios.get('http://localhost:3000/api/proveedores', { params: { id: req.query.id }})
        .then(response => {
            res.render('update_provider', { provider: response.data });
        })
        .catch(err => res.send(err));
};




// ==================== USUARIOS =========================
exports.create_user_form = async (req, res) => {
    try {
        const rolesRes = await axios.get('http://localhost:3000/api/roles');
        res.render('add_user', { roles: rolesRes.data });
    } catch (err) { res.send(err); }
};

exports.add_user = async (req, res) => {
    try {
        if (!req.body.nombre || !req.body.email || !req.body.telefono || !req.body.direccion) {
            return res.status(400).json({ message: "Nombre, email, teléfono y dirección son obligatorios." });
        }

        await axios.post('http://localhost:3000/api/users', req.body);
        res.redirect('/read-user');
    } catch (err) {
        console.log(err.response?.data || err.message);
        res.status(500).send(err.response?.data || err.message);
    }
};

exports.read_users = async (req, res) => {
    try {
        const response = await axios.get('http://localhost:3000/api/users');
        res.render('read_users', { users: response.data });
    } catch (err) { res.send(err); }
};

exports.update_user = async (req, res) => {
    try {
        const response = await axios.get('http://localhost:3000/api/users/' + req.params.id);
        res.render('update_user', { user: response.data });
    } catch (err) { res.send(err); }
};



// ==================== ROLES ============================
exports.create_rol_form = (req, res) => {
    res.render('create_rol'); // formulario simple: nombre del rol
};


exports.read_roles = (req, res) => {
    axios.get('http://localhost:3000/api/roles')
        .then(response => {
            res.render('read_rols', { roles: response.data });
        })
        .catch(err => res.send(err));
};


exports.update_rol = (req, res) => {
    axios.get('http://localhost:3000/api/roles', { params: { id: req.query.id }})
        .then(response => {
            res.render('update_rol', { rol: response.data });
        })
        .catch(err => res.send(err));
};


exports.create_rol = (req, res) => {
    console.log(req.body);
    res.render('create_rol');
};


// ==================== VENTAS ===========================
exports.create_sale_form = (req, res) => {
    // Traemos productos y usuarios para el formulario
    Promise.all([
        axios.get('http://localhost:3000/api/productos'),
        axios.get('http://localhost:3000/api/users')
    ])
    .then(([productosRes, usersRes]) => {
        res.render('create_ventas', { 
            productos: productosRes.data, 
            users: usersRes.data 
        });
    })
    .catch(err => res.send(err));
};


exports.sales = (req, res) => {
    axios.get('http://localhost:3000/api/ventas')
        .then(response => {
            res.render('read_sales', { sales: response.data });
        })
        .catch(err => res.send(err));
};


exports.update_sale = (req, res) => {
    axios.get('http://localhost:3000/api/ventas', { params: { id: req.query.id }})
        .then(response => {
            res.render('update_sale', { sale: response.data });
        })
        .catch(err => res.send(err));
};


// ================= DETALLE VENTAS ======================
exports.create_sale_detail_form = (req, res) => {
    // Traemos ventas y productos para el detalle
    Promise.all([
        axios.get('http://localhost:3000/api/ventas'),
        axios.get('http://localhost:3000/api/productos')
    ])
    .then(([ventasRes, productosRes]) => {
        console.log("VENTAS:", req.body);
        console.log("PRODUCTOS:", req.body);
        res.render('create_detalleVenta', { 
            ventas: ventasRes.data, 
            productos: productosRes.data 
        });
    })
    .catch(err => res.send(err));
};


exports.read_sale_details = (req, res) => {
    axios.get('http://localhost:3000/api/detalle-ventas')
        .then(response => {
            res.render('read_detailsSales', { saleDetails: response.data });
        })
        .catch(err => res.send(err));
};


exports.update_sale_detail = (req, res) => {
    axios.get('http://localhost:3000/api/detalle-ventas', { params: { id: req.query.id }})
        .then(response => {
            res.render('update_saleDetail', { detail: response.data });
        })
        .catch(err => res.send(err));
};


