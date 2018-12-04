const jwt = require('jsonwebtoken');

// Custom middleware for checking auth
module.exports = (req, res, next) => {
    if (!req.cookies.nToken) {
        res.locals.user = null;
    } else {
        const token = req.cookies.nToken;
        const decodedToken = jwt.decode(token, { complete: true }) || {};
        res.locals.user = decodedToken.payload;
    }
    return next();
};
