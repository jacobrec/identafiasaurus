const database = require('./database.js');

async function apiCheckEmail (req, res) {
  const email = req.params.email;
  const user = await database.getUserByEmail(email);
  console.log({user});
  if (user) {
    res.status(200);
    return res.send("Ok");
  } else {
    res.status(404);
    return res.send("Not Found");
  }
}

function apiSignup (req, res) {}
function apiSignin (req, res) {}
function apiValidate (req, res) {}
function apiUpgrade (req, res) {}

function createSigninFunctions (router) {
  router.get('/checkemail/:email', apiCheckEmail);
  router.post('/signin', apiSignin);
  router.post('/signup', apiSignup);
  router.get('/validate/:id', apiValidate);
  router.post('/upgrade', apiUpgrade);
}

module.exports = createSigninFunctions;
