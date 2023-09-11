const Router = require('koa-router');
const koaBody = require('koa-body');

const chatHistory = require('../../db');

const router = new Router();

// router.post('/check-nickname', (ctx) => {
//   console.log(typeof ctx.request.body);
//   console.log(ctx.request.body);

//   ctx.response.body = 'subscriptions';

//   const { name, phone } = ctx.request.body;

//   ctx.response.set('Access-Control-Allow-Origin', '*');

//   if (subscription.data.some(sub => sub.phone === phone)) {
//     ctx.response.status = 400;
//     ctx.response.body = { status: "subscriprion exists" };

//     return;
//   }

//   subscriptions.add({ name, phone });

//   ctx.response.body = { status: "OK" };
// });

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
    if (chatHistory.users.has(nickname)) {
      ctx.status = 400;
      ctx.body = {
        message: `The name \'${nickname}\' already exists`,
        available: false,
      };
      return;
    } else {
      chatHistory.addUser(nickname);
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

  if (!chatHistory.users.has(nickname)) {
    ctx.response.status = 400;
    ctx.response.body = { status: "user doesn\'t exists" };

    return;
  }

  chatHistory.removeUser(nickname);

  ctx.response.body = { status: "OK" };
});

module.exports = router;
