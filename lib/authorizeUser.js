// Function for making sure that the user is authorized to complete a specific type of action
module.exports = (req, res, next) => {
    if (res.locals.user) {
        return next();
    }

    return res.status(401).send('youre not permitted to do this action');
};
