var promise = require("bluebird");

var options = {
  // Initialization Options
  promiseLib: promise,
};

var pgp = require("pg-promise")(options);

const connectionString =
  "postgres://ionkjzfueyuqig:6fa6976ac9c10b93d91e502dd92d6382df8152d50cb5d5cb2873196a2760ebb4@ec2-52-202-152-4.compute-1.amazonaws.com:5432/d6vu3gq3fqdjkf";
let ssl = { rejectUnauthorized: false };
const config = {
  connectionString: connectionString,
  ssl: ssl,
};
var db = pgp(config);
module.exports = db;
