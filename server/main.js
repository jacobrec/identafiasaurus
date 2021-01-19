const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
var cookieParser = require('cookie-parser')

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
const database = require('./database.js');

const secureEndpoints = express.Router();
const endpoints = express.Router();

const tokenExtracter = (req, res, next) => {
  const cookies = req.cookies;
  req.tok = cookies.auth;
  next();
};

const secure = (req, res, next) => {
  const isTokenValid = (tok) => false;
  if (!req.tok) {
    res.status(401);
    return res.send('Missing Token');
  } else if (!isTokenValid(req.tok)) {
    res.status(403);
    return res.send('Invalid Token');
  } else {
    next();
    return null;
  }
};


secureEndpoints.use(cookieParser());
secureEndpoints.use(tokenExtracter);
secureEndpoints.use(secure);

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
secureEndpoints.get('/refresh', (req, res) => {return res.send("aaahhh")});


handleArgs(process.argv);
