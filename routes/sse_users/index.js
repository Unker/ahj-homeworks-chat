const Router = require('koa-router');
const { streamEvents } = require('http-event-stream');
const { v4 } = require('uuid');
const { chatUsers } = require('../../db');

const router = new Router();

router.get('/sseUsers', async (ctx) => {
  const { token } = ctx.query;
  console.log('/sseUsers token',token)
  if (!token) {
    ctx.respond = false;
    return;
  }

  streamEvents(ctx.req, ctx.res, {
    async fetch(lastEventId) {
      console.log('lastEventId', lastEventId);

      return [];
    },

    async stream(sse) {
      chatUsers.listen((items) => {
        console.log('/sseUsers JSON', JSON.stringify([...items]))
        sse.sendEvent({
          id: v4(),
          event: 'updateUser',
          data: JSON.stringify([...items]),
        });
      });

      ctx.req.on('close', () => {
        console.log('disconnected', token);
        chatUsers.remove(token);
      })

      return () => { };
    },

  });

  ctx.respond = false;
});

module.exports = router;
