const server = require('graphql-server-micro');
const schema = require('./schema');

module.exports = server.microGraphql({ schema });
