const Userdb = require('../model/user');
const bcrypt = require('bcrypt');

// LOGIN
exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await Userdb
            .findOne({ email })
            .populate('rol');

        if (!user) {
            return res.send("Usuario no encontrado");
        }

        if (user.estado !== "Activo") {
            return res.send("Usuario desactivado");
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.send("Contraseña incorrecta");
        }

        // guardar sesión
        req.session.user = {
            id: user._id,
            nombre: user.nombre,
            rol: user.rol.nombre
        };

        // redirección
        if (user.rol.nombre === "Admin") {

            res.redirect('/read-producto');

        } else {

            res.redirect('/');

        }

    } catch (err) {

        console.error(err);
        res.status(500).send("Error en login");

    }

};

// LOGOUT
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        res.clearCookie('connect.sid'); // nombre por defecto de la cookie de express-session
        if (err) {
            return res.send("Error al cerrar sesión");
        }
        res.redirect('/login');
    });
};