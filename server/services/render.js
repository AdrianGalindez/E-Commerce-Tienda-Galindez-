const axios = require('axios');

// Página principal (clientes)
exports.homeRoutes = (req, res) => {
    axios.get('http://localhost:3000/api/productos')
        .then(response => {
            res.render('index', { productos: response.data });
        })
        .catch(err => res.send(err));
};

// Formulario para agregar usuario
exports.add_user = (req, res) => {
    res.render('add_user');
};




// categoria dinamica
exports.categoria = (req, res) => {
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
exports.marcas = (req, res) => {
    axios.get('http://localhost:3000/api/marcas')
        .then(response => {
            res.render('marcas', { marcas: response.data });
        })
        .catch(err => res.send(err));
};



// PROMOCIONES
exports.promociones = (req, res) => {
    axios.get('http://localhost:3000/api/productos')
        .then(response => {
            const productos = response.data.filter(p => p.stock > 20);
            res.render('promociones', { productos });
        })
        .catch(err => res.send(err));
};



// CARRITO
exports.carrito = (req, res) => {
    res.render('carrito');
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
exports.create_categoria = (req, res) => {
    res.render('create_categoria');
};

exports.create_marca = (req, res) => {
    res.render('create_marca');
};

// no entiendo esta linea
exports.create_producto = (req, res) => {
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

exports.create_proveedor = (req, res) => {
    res.render('create_proveedor');
};

exports.create_rol = (req, res) => {
    res.render('create_rol');
};



// VENTAS
exports.ventas = (req, res) => {
    axios.get('http://localhost:3000/api/ventas')
        .then(response => {
            res.render('ventas', { ventas: response.data });
        })
        .catch(err => {
            console.error("Error al obtener ventas:", err);
            res.status(500).send("Error al cargar las ventas");
        });
};
