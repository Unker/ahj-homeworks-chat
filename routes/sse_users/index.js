const Router = require('koa-router');
const { streamEvents } = require('http-event-stream');
const { v4 } = require('uuid');
const { chatUsers } = require('../../db');

const router = new Router();

router.get('/sseUsers', async (ctx) => {
  streamEvents(ctx.req, ctx.res, {
    async fetch(lastEventId) {
      console.log('lastEventId', lastEventId);

      return [];
    },

    async stream(sse) {
      chatUsers.listen((items) => {
        console.log(items)
        sse.sendEvent({
          id: v4(),
          event: 'updateUser',
          data: JSON.stringify([...items]),
        });
      });

      return () => { };
    }
  });

  ctx.respond = false;
});

function findUserBySSE(sse) {
  // Функция для поиска никнейма пользователя по его SSE соединению
  for (const user of chatUsers) {
    if (user.sse === sse) {
      return user.nickname;
    }
  }
  return null;
}

module.exports = router;