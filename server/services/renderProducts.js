const axios = require('axios');

// Detalle de producto
exports.product_detail = async (req, res) => {

    try {
        const id = req.params.id;
        const [productRes, reviewsRes] = await Promise.all([

            axios.get('http://localhost:3000/api/productos', {
                params: { id }
            }),

            axios.get('http://localhost:3000/api/reviews', {
                params: { producto: id }
            })

        ]);
        const product = productRes.data;
        const reviews = reviewsRes.data;
        res.render('client/products/product_detail', { product, reviews });
    } catch (err) {
        res.send(err);
    }
};


// ==================== PRODUCTOS ========================
exports.create_product = (req, res) => {
    axios.post('http://localhost:3000/api/productos', req.body)
        .then(response => {
            console.log("PRODUCTO======================:", req.body);
            res.redirect('admin/products/create-producto');
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
            res.render('admin/products/read_products', { productos: response.data });
        })
        .catch(err => res.send(err));
};


exports.update_products = async (req, res) => {
    try {

        const id = req.query.id;

        const response = await axios.get('http://localhost:3000/api/productos', {
            params: { id }
        });

        const producto = response.data;

        const [marcasRes, categoriasRes, proveedoresRes] = await Promise.all([
            axios.get('http://localhost:3000/api/marcas'),
            axios.get('http://localhost:3000/api/categorias'),
            axios.get('http://localhost:3000/api/proveedores')
        ]);

        res.render('admin/products/update_products', {
            producto,
            marcas: marcasRes.data,
            categorias: categoriasRes.data,
            proveedores: proveedoresRes.data
        });

    } catch (err) {
        console.error("ERROR UPDATE PRODUCT:", err);
        res.status(500).send(err.message);
    }
};


exports.delete_product = (req, res) => {
    axios.delete(`http://localhost:3000/api/productos/${req.params.id}`)
        .then(response => {
             res.redirect('admin/products/read-producto');
        })
        .catch(err => res.send(err));
};
