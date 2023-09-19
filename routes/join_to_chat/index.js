const Router = require('koa-router');
const koaBody = require('koa-body');
const { v4 } = require('uuid');

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
    };
    return;
  } else {
    if (chatUsers.isIncludeUser(nickname)) {
      ctx.status = 400;
      ctx.body = {
        message: `The name \'${nickname}\' already exists`,
        available: false,
      };
      return;
    } else {
      const token = v4();
      chatUsers.add(token, nickname);
      ctx.body = JSON.stringify({
        nickname,
        token,
        available: true,
      });
      ctx.status = 201;
    }
  }
});

router.delete('/check-nickname/:nickname', (ctx) => {
  const { nickname } = ctx.params;
  const authHeader = ctx.request.headers.authorization;
  if (authHeader) {
    const [, token] = authHeader.split(' '); // Разбиваем заголовок на части
    ctx.token = token; // Сохраняем токен в контексте Koa
  }

  ctx.response.set('Access-Control-Allow-Origin', '*');

  // проверяем корректность токена
  if (!ctx.token || chatUsers.users.get(ctx.token) !== nickname) {

    ctx.response.status = 400;
    ctx.response.body = { status: "user doesn\'t exists or invalid token" };

    return;
  }

  chatUsers.remove(ctx.token);

  ctx.response.body = { status: "OK" };
});

module.exports = router;
