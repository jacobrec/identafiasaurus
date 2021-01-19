const jwt = require('jsonwebtoken');
const { unixtime } = require('./utils.js');
const jwtSecret = "secret";

function create(params) {
  const isTmp = params.tmp === true;
  const tokObj = params.user;
  delete tokObj.findings;
  delete tokObj._id;
  delete tokObj.validation;
  tokObj.exp = unixtime() + (isTmp ? 60 * 15 : 60 * 60 * 24 * 7); // 15min or 7days
  tokObj.isFull = !isTmp;
  console.log(tokObj);
  return jwt.sign(tokObj, jwtSecret);
}

function parse(tok) {
  try {
    return jwt.verify(tok, jwtSecret);
  } catch (e) {
    return false;
  }
}

module.exports = {
  create,
  parse,
}
