var JsonWebTokenAuth = require('../models/jwt_auth');

export function verifyJWT_MW(req, res, next) {
  let token = (req.method === 'POST') ? req.body.token : req.query.token

  JsonWebTokenAuth.verifyJWTToken(token).then((decodedToken) => {
      req.user = decodedToken.data;
      next();
    }).catch((err) => {
      res.status(400).json({message: "Invalid auth token provided."})
    });
};
