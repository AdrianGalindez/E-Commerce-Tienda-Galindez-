const session = require('express-session');


module.exports = session({
    secret: "tienda-galindez",
    resave: false,
    saveUninitialized: false
})
