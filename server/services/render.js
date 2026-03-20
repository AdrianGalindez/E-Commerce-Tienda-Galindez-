const axios = require('axios');
// ====================CLIENTES================
// Página principal (clientes)
exports.homeRoutes = (req, res) => {
    axios.get('http://localhost:3000/api/productos')
        .then(response => {
            res.render('index', { productos: response.data });
        })
        .catch(err => res.send(err));
};


// categoria dinamica
exports.category = (req, res) => {
    axios.get('http://localhost:3000/api/productos')
        .then(response => {
            const productos = response.data.filter(p => 
                p.categoria?.nombre === req.params.nombre
            );
            res.render('categoria', { productos });
        })
        .catch(err => res.send(err));
};



// MARCAS
exports.brand = (req, res) => {
    axios.get('http://localhost:3000/api/marcas')
        .then(response => {
            res.render('marcas', { marcas: response.data });
        })
        .catch(err => res.send(err));
};



// PROMOCIONES
exports.promotion = (req, res) => {
    axios.get('http://localhost:3000/api/productos')
        .then(response => {
            const productos = response.data.filter(p => p.stock > 20);
            res.render('promociones', { productos });
        })
        .catch(err => res.send(err));
};




// CARRITO
exports.car = (req, res) => {
    res.render('carrito');
};



// ===============================ADMIN==============================
// FORMULARIO PARA CREAR USUARIO
exports.add_user = (req, res) => {
    res.render('add_user');
};


// ACTUALIZAR USUARIO
exports.update_user = (req, res) => {
    axios.get('http://localhost:3000/api/users', { params: { id: req.query.id } })
        .then(userdata => {
            res.render('update_user', { user: userdata.data });
        })
        .catch(err => res.send(err));
};

// ADMIN CREACIÓN
exports.create_category = (req, res) => {
    res.render('create_categoria');
};

//CREAR MARCA 
exports.create_brand = (req, res) => {
    res.render('create_marca');
};

// CREAR PRODUCTO
exports.create_product = (req, res) => {
    Promise.all([
        axios.get('http://localhost:3000/api/categorias'),
        axios.get('http://localhost:3000/api/marcas')
    ])
    .then(([categoriasRes, marcasRes]) => {
        res.render('create_producto', {
            categorias: categoriasRes.data,
            marcas: marcasRes.data
        });
    })
    .catch(err => res.send(err));
};

// CREAR PROVEEDOR
exports.create_provider = (req, res) => {
    res.render('create_proveedor');
};

// CREAR ROL 
exports.create_rol = (req, res) => {
    res.render('create_rol');
};

// VER VENTAS
exports.sales = (req, res) => {
    axios.get('http://localhost:3000/api/ventas')
        .then(response => {
            res.render('ventas', { ventas: response.data });
        })
        .catch(err => {
            console.error("Error al obtener ventas:", err);
            res.status(500).send("Error al cargar las ventas");
        });
};
