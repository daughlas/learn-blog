const Koa = require('../lib/koa2/like-koa2');
const app = new Koa();

// logger

app.use(async (ctx, next) => {
  console.log('level one start')
  await next();
  const rt = ctx['X-Response-Time'];
  console.log(`${ctx.req.method} ${ctx.req.url} - ${rt}`);
  console.log('level one end')
});

// x-response-time

app.use(async (ctx, next) => {
  console.log('level two start')
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx['X-Response-Time'] = `${ms}ms`;
  console.log('level two end')
});

// response

app.use(async ctx => {
  console.log('level three start')
  ctx.res.end('Hello World, this is a mock application of koa2');
  console.log('level three end')
});

app.listen(3000);