const axios = require('axios');

// Página principal
exports.homeRoutes = (req, res) => {
    axios.get('http://localhost:3000/api/productos')
        .then(response => {
            console.log("HOME read productos:", response.data);
            res.render('index', { productos: response.data });
        })
        .catch(err => res.send(err));
};