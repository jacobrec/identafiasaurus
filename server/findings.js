const database = require('./database.js');

async function getFindings(req, res) {
  const data = await database.getAllFindings();
  const items = data.map((i) => {
    delete i._id;
    return i;
  });

  return res.send({ items });
}

function createFindingsFunctions (router) {
  router.get('/findings', getFindings);
}

module.exports = createFindingsFunctions;
