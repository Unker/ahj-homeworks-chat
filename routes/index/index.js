const Router = require('koa-router');
const { chatUsers, chatHistory } = require('../../db');

const router = new Router();

router.get('/users', async (ctx) => {
  ctx.response.body = JSON.stringify([...chatUsers.users.values()]);
});

router.get('/chat', async (ctx) => {
  ctx.response.body = JSON.stringify([...chatHistory.messages]);
});

module.exports = router;
