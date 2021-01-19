const { MongoClient } = require('mongodb');
const { v4: uuid } = require('uuid');
const loc = "mongodb://localhost:27017/";
const DB = "dino";
const USERS = "Users";
const FINDINGS = "Findings";

async function getUserByEmail(email) {
  const col = await getCollection(USERS);
  const usr = await col.findOne({email});
  return usr;
}

async function getCollection(name) {
    const client = await MongoClient.connect(loc);
    const db = await client.db(DB);
    return db.collection(name);
}

function validateUser(usr) {
  return true;
}

async function addUser(usr) {
  if (validateUser(usr)) {
    const users = await getCollection(USERS);
    const id = uuid();
    users.insertOne({ ...usr, id });
    return id;
  }
  return null;
}

function validateFinding(finding) {
  return true;
}
async function addFinding(finding, usr) {
  if (validateFinding(finding)) {
    const collection = await getCollection(FINDINGS);
    const id = uuid();
    collection.insertOne({
      date: Math.floor(new Date().getTime() / 1000),
      ...finding,
      usr,
      id,
    });

    const users = await getCollection(USERS);
    users.updateOne({ id: usr }, {$push : {findings: id}})
    return id;
  }
  return null;
}

async function resetDatabase() {
  const rmusers = await getCollection(USERS);
  rmusers.drop();
  const rmfindings = await getCollection(FINDINGS);
  rmfindings.drop();

  const testymctestface = await addUser( {
    email: "testymctestface@example.com",
    name: "Testy McTestface",
    validated: false,
    verified: false,
    findings: [],
  } );
  const users = await getCollection(USERS);
  const didUserIndicesCreate = await users.createIndex({ id: 1, email: 1, validated: 1 });

  const findingId = await addFinding( {
    image: "http://imageurl.img/img.png",
  }, testymctestface);
  const findings = await getCollection(FINDINGS);
  const didFindingIndicesCreate = await users.createIndex({ id: 1 });

  const printCollection = (col) => {
    var cursor = col.find();
    cursor.each(function(err, doc) {
      console.log(doc);
    });
  }

  printCollection(users);
  printCollection(findings);
  console.log("Created indices on Users:", didUserIndicesCreate);
  console.log("Created indices on Findings:", didFindingIndicesCreate);
}

module.exports = {
  resetDatabase,
  addFinding,
  addUser,
  getUserByEmail,
};
