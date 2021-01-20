const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const cookieParser = require('cookie-parser');
const createSignin = require('./signin.js');
const createFindings = require('./findings.js');
const database = require('./database.js');
const token = require('./tokens.js');


// handle command line args
function handleArgs(args) {
  const hasFlag = (arg) => args.some((e) =>(typeof e === "string") && e.replace(/^-+/, "") === arg);
  if (hasFlag("reset")) {
    console.log("Reseting Database")
    database.resetDatabase();
  } else { // start the server
    app.listen(process.env.PORT || 8080);
  }
}

// setup express app
const app = express();

const secureEndpoints = express.Router();
const endpoints = express.Router();

const tokenExtracter = (req, res, next) => {
  const cookies = req.cookies;
  req.tok = cookies.auth;
  next();
};

const secure = (req, res, next) => {
  const isTokenValid = (tok) => {
    const usr = token.parse(tok);
    return usr && usr.isFull
  };
  if (!req.tok) {
    res.status(401);
    return res.send('Missing Token');
  } else if (!isTokenValid(req.tok)) {
    res.status(403);
    return res.send('Invalid Token');
  } else {
    req.tok = token.parse(req.tok);
    next();
    return null;
  }
};


secureEndpoints.use(cookieParser());
secureEndpoints.use(tokenExtracter);
secureEndpoints.use(secure);

endpoints.use(cookieParser());
endpoints.use(bodyParser());

app.use('/api/', endpoints);
app.use('/api/', secureEndpoints);

app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// add api endpoints
createSignin(endpoints);
secureEndpoints.get('/refresh', async (req, res) => {
  const tok = token.create({user: await database.getUserById(req.tok.id)});
  res.cookie('auth', tok, {httpOnly: true})
  return res.send("Ok");
});

secureEndpoints.get('/profile', async (req, res) => {
  const user = await database.getUserById(req.tok.id);
  user.findings = user.findings.length;
  delete user._id;
  delete user.id;
  delete user.validation;
  return res.send(user);
});
createFindings(secureEndpoints);


handleArgs(process.argv);
