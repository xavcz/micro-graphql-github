const cors = require('micro-cors')();
const server = require('graphql-server-micro');
const schema = require('./schema');

module.exports = cors(server.microGraphql({ schema }));
