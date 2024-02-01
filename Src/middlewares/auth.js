function auth(req, res, next) {
    console.log(req.session);
    if (req.session.user && req.session.role === "admin") return next();
    else return res.sendStatus(401);
}

module.exports = auth