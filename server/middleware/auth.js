exports.isAdmin = (req, res, next) => {

    if (!req.session.user) {
        return res.redirect('/login');
    }

    if (req.session.user.rol !== "Admin") {
        return res.redirect('/');
    }

    next();
};