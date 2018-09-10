const jwt = require('jwt-simple');
const User = require('../models/user');
const { secret } = require('../config');

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    const { id } = user

    return jwt.encode({ sub: id, iat: timestamp }, secret);
}

exports.signIn = function(req, res, next) {
    const { user } = req

    res.send({ token: tokenForUser(user) });
}

exports.signUp = function(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).send({ error: 'You must provide email and password '});
    }

    User.findOne({ email }, (err, existingUser) => {
        if (err) { return next(err); }

        if (existingUser) {
            return res.status(422).send({ error: 'Email is in use'});
        }
        
        const user = new User({
            email,
            password
        });

        user.save(err => {
            if (err) { return next(err); }
        });
        
        res.json({ token: tokenForUser(user) });
    });
}