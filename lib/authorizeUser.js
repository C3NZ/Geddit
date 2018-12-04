module.exports = function checkAuth(user, res) {
    if (!user) {
        return res.status(401).send('Youre not authorized to complete this action')
    }
}
