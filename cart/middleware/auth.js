//auth  Middleware
const jwt = require('jsonwebtoken');

const jwtPrivateKey = {
    "Key": "8NUb4tuz2u2L9206trcsize43tFDE0FBnn4x8RVWsv4=",
    "Issuer": "SecureApi",
    "Audience": "SecureApiUser",
    "DurationOnDays": 30
};
module.exports = function (req, res, next) {
    //bearer token
    let token = req.header('Authorization');


    if (!token) return res.status(401).send('Access denied. No token provided.');
    token = token.split(' ')[1];


    try {
        const decoded = jwt.verify(token, jwtPrivateKey.Key, {
            issuer: jwtPrivateKey.Issuer,
            audience: jwtPrivateKey.Audience,
            expiresIn: jwtPrivateKey.DurationOnDays

        });

        req.params.userId = decoded.userId;

        req.user = decoded;
        console.log(req.user);
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
}