const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const WS = require('ws');

const router = require('./routes');
const { chatUsers, chatHistory } = require('./db');

require('dotenv').config();

const app = new Koa();

app.use(koaBody({
  urlencoded: true,
}));

app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*', };

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }

    ctx.response.status = 204;
  }
});

app.use(router());

const port = process.env.SERVER_PORT || 7070;
const server = http.createServer(app.callback());

const wsServer = new WS.Server({
  server
});

wsServer.on('connection', (ws) => {
  console.log('connected to ws')
  ws.on('message', (data) => {
    const { nickName, message } = JSON.parse(data);
    console.log('ws message json:', JSON.parse(data));

    chatHistory.add(nickName, message);

    const eventData = JSON.stringify(chatHistory.messages.slice(-1));

    Array.from(wsServer.clients)
      .filter(client => client.readyState === WS.OPEN)
      .forEach(client => client.send(eventData));
  });

  // отправка всех сообщений
  ws.send(JSON.stringify([...chatHistory.messages]));
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

