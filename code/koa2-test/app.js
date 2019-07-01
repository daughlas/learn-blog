const Koa = require('koa');
const app = new Koa();

// logger

app.use(async (ctx, next) => {
  console.log('level one start')
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
  console.log('level one end')
});

// x-response-time

app.use(async (ctx, next) => {
  console.log('level two start')
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
  console.log('level two end')
});

// response

app.use(async ctx => {
  console.log('level three start')
  ctx.body = 'Hello World';
  console.log('level three end')
});

app.listen(3000);