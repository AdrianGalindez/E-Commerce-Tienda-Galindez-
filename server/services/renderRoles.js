const axios = require('axios');

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

exports.delete_rol = (req, res) => {
    axios.delete(`http://localhost:3000/api/roles/${req.params.id}`)
        .then(response => {
            res.redirect('/read-rol');
        })
        .catch(err => res.send(err));
};