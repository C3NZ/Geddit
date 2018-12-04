const jwt = require('jsonwebtoken');

//Custom middleware for checking auth
module.exports = function checkAuth(req, res, next)  {
    console.log('checking authentication');
    if (!req.cookies.nToken) {
        res.locals.user = null;
    } else {
        let token = req.cookies.nToken;
        let decodedToken = jwt.decode(token, {complete: true}) || {};
        res.locals.user = decodedToken;
        console.log(res.locals.user);
    }
    next();
};


