const Router = require('koa-router');
const chatHistory = require('../../db');

const router = new Router();

router.get('/users', async (ctx) => {
  ctx.response.body = JSON.stringify([...chatHistory.users]);
});

module.exports = router;
