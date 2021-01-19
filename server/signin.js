const database = require('./database.js');
const token = require('./tokens.js');


async function apiCheckEmail (req, res) {
  const email = req.params.email;
  const user = await database.getUserByEmail(email);
  if (user) {
    res.status(204);
    return res.send();
  } else {
    res.status(404);
    return res.send("Not Found");
  }
}

async function completeSign(res, id) {
  const slug = await database.resetValidation(id)
  console.log(`http://localhost:3000/api/validate/${slug}`)
  const tok = token.create({tmp: true, user: await database.getUserById(id)});
  res.cookie('auth', tok, {httpOnly: true})
  return res.send("Ok");
}

async function apiSignup (req, res) {
  const usr = req.body;
  const user = await database.getUserByEmail(usr.email);
  const id = !user ? await database.addUser(usr) : user.id;
  return completeSign(res, id)
}

async function apiSignin (req, res) {
  const email = req.body.email;
  const user = await database.getUserByEmail(email);
  completeSign(res, user.id);
}

async function apiValidate (req, res) {
  const slug = req.params.slug;
  await database.completeValidation(slug);
  return res.send("Thanks! Return to the original page to complete the signin!");
}

async function apiUpgrade (req, res) {
  const tok = req.cookies.auth;
  const user = token.parse(tok);
  if (user) {
    const id = user.id;
    const hasValidated = await database.hasValidation(id);
    if (hasValidated) {
      const tok = token.create({user: await database.getUserById(id)});
      res.cookie('auth', tok, {httpOnly: true})
      return res.send("Ok");
    } else {
      res.status(403);
      return res.send("User not yet validated");
    }
  } else {
    res.status(401);
    return res.send("Invalid token");
  }
}

function createSigninFunctions (router) {
  router.get('/checkemail/:email', apiCheckEmail);
  router.post('/signin', apiSignin);
  router.post('/signup', apiSignup);
  router.get('/validate/:slug', apiValidate);
  router.get('/upgrade', apiUpgrade);
}

module.exports = createSigninFunctions;
