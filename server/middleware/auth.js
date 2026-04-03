exports.isAdmin = (req, res, next) => {

    if (!req.session.user) {
        return res.redirect('/login');
    }

    if (req.session.user.rol !== "Admin") {
        return res.status(403).send("Acceso denegado");
    }

    next();

};


exports.isLogged = (req, res, next) => {

    if (!req.session.user) {
        return res.redirect('/login');
    }

    next();

};