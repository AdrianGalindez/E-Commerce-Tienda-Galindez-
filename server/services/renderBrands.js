const axios = require('axios');

// Marcas (cliente)
exports.brands = (req, res) => {
    axios.get('http://localhost:3000/api/marcas')
        .then(response => {
            res.render('brands', { brands: response.data });
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

exports.delete_brand = (req, res) => {
    axios.delete(`http://localhost:3000/api/marcas/${req.params.id}`)
        .then(response => {
            res.redirect('/read-marca'); // importante
        })
        .catch(err => res.send(err));
};


exports.Productbrands = (req, res) => {
    axios.get('http://localhost:3000/api/productos')
        .then(response => {

            const data = response.data;

            // 1️Filtrar productos
            const productos = data.filter(p => 
                p.marca?.nombre === req.params.marca
            );
            res.render('Product_brands', { products : productos , marca: req.params.marca });

        })
        .catch(err => res.send(err));
};