//generate signature for token sent and received from client
require('dotenv').config();
const jwt = require('jsonwebtoken');

const TOKEN_COOKIE_NAME = "Colorie-Token";
// In a real application, you will never hard-code this secret and you will
// definitely never commit it to version control, ever
const API_SECRET = process.env.API_SECRET_KEY;

exports.TokenMiddleware = (req, res, next) => {
  // We will look for the token in two places:
  // 1. A cookie in case of a browser
  // 2. The Authorization header in case of a different client
  let token = null;
  // if no cookie extract the token from the Authorization header
  if (!req.cookies[TOKEN_COOKIE_NAME]) {
    //No cookie, so let's check Authorization header
    const authHeader = req.get('Authorization');
    if (authHeader && authHeader.startsWith("Bearer ")) {
      //Format should be "Bearer token" but we only need the token
      token = authHeader.split(" ")[1].trim();
    }
  }
  // If we have a cookie, read the value from the cookie
  else { //We do have a cookie with a token
    token = req.cookies[TOKEN_COOKIE_NAME]; //Get session Id from cookie
  }

  if (!token) { // If we don't have a token
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  //If we've made it this far, we have a token. We need to validate it

  try {
    //Verify the token and return the decoded payload (this change)
    const decoded = jwt.verify(token, API_SECRET);
    // we populate the user in the request object
    req.user = decoded.user;
    next(); //Make sure we call the next middleware
  }
  catch (err) { //Token is invalid
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }


}

// happens when you log in
exports.generateToken = (req, res, user) => {
  let data = {
    user: user,
    // Use the exp registered claim to expire token in 1 hour
    exp: Math.floor(Date.now() / 1000) + (60 * 60)
  }


  // pass the data and the sectret to jwt to generate the token
  // get the header, payload and signature
  // and this too
  const token = jwt.sign(data, API_SECRET);

  //send token in cookie to client
  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 1000 //This session expires in 2 minutes.. but token expires in 1 hour!
  });
};

// when log out
exports.removeToken = (req, res) => {
  //send session ID in cookie to client
  res.cookie(TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    maxAge: -360000 //A date in the past
  });

}