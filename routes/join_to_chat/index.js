const Router = require('koa-router');
const koaBody = require('koa-body');

const { chatUsers } = require('../../db');

const router = new Router();

router.post('/check-nickname', koaBody({
  urlencoded: true,
}), (ctx) => {
  const { nickname } = ctx.query;
  console.log('POST nickname:', nickname)
  if (!nickname) {
    ctx.status = 400;
    ctx.body = {
      message: 'Field \'name\' does not setted',
      available: false,
    };
    return;
  } else {
    if (chatUsers.users.has(nickname)) {
      ctx.status = 400;
      ctx.body = {
        message: `The name \'${nickname}\' already exists`,
        available: false,
      };
      return;
    } else {
      chatUsers.add(nickname);
      ctx.body = JSON.stringify({
        nickname,
        available: true,
      });
      ctx.status = 201;
    }
  }
});

router.delete('/check-nickname/:nickname', (ctx) => {
  const { nickname } = ctx.params;

  ctx.response.set('Access-Control-Allow-Origin', '*');

  if (!chatUsers.users.has(nickname)) {
    ctx.response.status = 400;
    ctx.response.body = { status: "user doesn\'t exists" };

    return;
  }

  chatUsers.remove(nickname);

  ctx.response.body = { status: "OK" };
});

module.exports = router;
