const combineRouters = require('koa-combine-routers');

const index = require('./index/index.js');
const join = require('./join_to_chat/index.js');
const sseUsers = require('./sse_users');

const router = combineRouters(
  index,
  join,
  sseUsers,
);

module.exports = router;
