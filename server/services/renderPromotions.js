const axios = require('axios');

// Promociones
exports.promotions = (req, res) => {
    axios.get('http://localhost:3000/api/productos')
        .then(response => {
            const productos = response.data.filter(p => p.stock > 20);
            res.render('promotions', { productos });
        })
        .catch(err => res.send(err));
};